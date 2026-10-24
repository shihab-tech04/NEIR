import React, { useEffect, useMemo, useState } from 'react';
import {
  Checkbox as MuiCheckbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination as MuiTablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { TableSkeleton, EmptyState, ErrorState } from '../feedback/FeedbackStates.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';
import { SafeText } from '../data-display/SafeText.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const MobileRecordCard = ({
  title,
  subtitle,
  status,
  fields = [],
  footerMeta,
  actions,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <article className={'px-5 py-5 bg-[var(--color-surface)] flex flex-col gap-4 ' + className}>
      <div className="min-w-0">
        <h4 className="type-body font-medium text-[var(--color-text-primary)] break-words">{title}</h4>
        {subtitle && <p className="type-meta text-[var(--color-text-secondary)] mt-1 break-words">{subtitle}</p>}
      </div>

      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.label || index} className="grid grid-cols-[minmax(92px,0.8fr)_minmax(0,1.2fr)] gap-3">
              <p className="type-meta text-[var(--color-text-secondary)]">{t(field.label)}</p>
              <p className="type-body-sm font-medium text-[var(--color-text-primary)] break-words">{field.value || '—'}</p>
            </div>
          ))}
        </div>
      )}

      {(status || footerMeta || actions) && (
        <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {status && <StatusBadge status={status} size="sm" showIcon={false} plain />}
          </div>
          <div className="ml-auto flex items-center justify-end gap-3 min-w-0">
            {footerMeta && <p className="type-body-sm text-[var(--color-text-secondary)]">{footerMeta}</p>}
            {actions}
          </div>
        </div>
      )}
    </article>
  );
};

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  selectable = false,
  selectedKeys = [],
  onSelectChange,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
  renderMobileCard,
  onMobileCardClick,
  onRowClick,
  embedded = false,
  stickyHeader = false,
  scrollable = false,
  maxHeight = 'clamp(320px, 42vh, 400px)',
  className = '',
}) => {
  const { t, textSize } = usePreferences();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const dense = textSize === 'compact';

  const handleSort = (key) => {
    setSortConfig((previous) => previous.key === key
      ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const av = a?.[sortConfig.key];
      const bv = b?.[sortConfig.key];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      const comparison = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const usesControlledPagination = Boolean(onPageChange || onPageSizeChange);
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  const effectivePage = usesControlledPagination ? currentPage : internalPage;
  const effectivePageSize = usesControlledPagination ? pageSize : internalPageSize;
  const effectiveTotalItems = usesControlledPagination
    ? (totalItems || sortedData.length)
    : sortedData.length;
  const effectiveTotalPages = Math.max(1, Math.ceil(effectiveTotalItems / effectivePageSize));

  useEffect(() => {
    if (!pagination || usesControlledPagination) return;
    setInternalPage((previous) => Math.min(previous, effectiveTotalPages));
  }, [pagination, usesControlledPagination, effectiveTotalPages]);

  useEffect(() => {
    if (!pagination || usesControlledPagination) return;
    setInternalPage(1);
  }, [pagination, usesControlledPagination, data.length, sortConfig.key, sortConfig.direction, internalPageSize]);

  const shouldSliceLocally = pagination && sortedData.length > effectivePageSize;
  const visibleData = shouldSliceLocally
    ? sortedData.slice(
        (effectivePage - 1) * effectivePageSize,
        effectivePage * effectivePageSize
      )
    : sortedData;

  const pageKeys = visibleData.map((item) => item[keyField]);
  const selectedOnPage = pageKeys.filter((key) => selectedKeys.includes(key));
  const allSelected = pageKeys.length > 0 && selectedOnPage.length === pageKeys.length;
  const partiallySelected = selectedOnPage.length > 0 && !allSelected;

  const handleSelectAll = (event) => {
    if (!onSelectChange) return;

    if (event.target.checked) {
      onSelectChange([...new Set([...selectedKeys, ...pageKeys])]);
      return;
    }

    onSelectChange(selectedKeys.filter((key) => !pageKeys.includes(key)));
  };

  const handleSelectRow = (key) => {
    if (!onSelectChange) return;
    onSelectChange(
      selectedKeys.includes(key)
        ? selectedKeys.filter((item) => item !== key)
        : [...selectedKeys, key]
    );
  };

  const mobileCardClick = onMobileCardClick || onRowClick;
  const desktopVisibleClass = renderMobileCard ? 'hidden lg:block' : 'block';
  const wrapperClass = embedded
    ? 'bg-[var(--color-surface)] overflow-hidden flex flex-col'
    : 'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden flex flex-col';

  return (
    <div className={wrapperClass + ' ' + className}>
      {isLoading && <TableSkeleton rows={pageSize || 5} cols={columns.length} />}
      {!isLoading && isError && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {!isLoading && !isError && data.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {!isLoading && !isError && data.length > 0 && (
        <>
          {renderMobileCard && (
            <div className="lg:hidden mobile-record-stack">
              {sortedData.map((row, index) => {
                const key = row[keyField] || index;
                return (
                  <div
                    key={key}
                    role={mobileCardClick ? 'button' : undefined}
                    tabIndex={mobileCardClick ? 0 : undefined}
                    onClick={(event) => {
                      if (!mobileCardClick) return;
                      const interactiveTarget = event.target.closest?.('button, a, input, select, textarea, [role="button"], [role="checkbox"], [role="link"]');
                      if (interactiveTarget && interactiveTarget !== event.currentTarget) return;
                      mobileCardClick(row);
                    }}
                    onKeyDown={(event) => {
                      if (!mobileCardClick || event.target !== event.currentTarget) return;
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        mobileCardClick(row);
                      }
                    }}
                    className={(mobileCardClick
                      ? 'cursor-pointer transition-colors hover:bg-[var(--color-background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)] '
                      : '') + 'bg-[var(--color-surface)]'}
                  >
                    {renderMobileCard(row, index)}
                  </div>
                );
              })}
            </div>
          )}

          <div className={desktopVisibleClass}>
            <TableContainer
              component={Paper}
              elevation={0}
              square
              sx={{
                maxHeight: stickyHeader && scrollable ? maxHeight : 'none',
                overflowX: 'auto',
                overflowY: stickyHeader && scrollable ? 'auto' : 'visible',
                overscrollBehavior: 'contain',
                scrollbarGutter: 'stable',
                WebkitOverflowScrolling: 'touch',
                borderRadius: 0,
                '&::-webkit-scrollbar': {
                  width: 10,
                  height: 10,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'var(--color-background-subtle)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'var(--color-border-strong)',
                  borderRadius: 999,
                  border: '2px solid var(--color-background-subtle)',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'var(--color-text-muted)',
                },
              }}
            >
              <Table
                stickyHeader={stickyHeader && scrollable}
                size={dense ? 'small' : 'medium'}
                sx={{
                  minWidth: 720,
                  tableLayout: 'auto',
                  fontFamily: 'var(--font-ui)',
                  '& .MuiTableCell-root': {
                    whiteSpace: 'nowrap',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    fontFamily: 'var(--font-ui)',
                  },
                  '& .MuiTableHead-root .MuiTableRow-root': {
                    height: 42,
                    backgroundColor: 'var(--color-background-subtle)',
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--type-table-head-size)',
                    lineHeight: 'var(--type-compact-line)',
                    fontWeight: 'var(--font-weight-semibold)',
                    letterSpacing: 0,
                    color: 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--color-border)',
                  },
                  '& .MuiTableBody-root .MuiTableRow-root': {
                    height: 56,
                    backgroundColor: 'var(--color-surface)',
                    '&:hover': { backgroundColor: 'var(--color-background-subtle)' },
                  },
                  '& .MuiTableBody-root .MuiTableCell-root': {
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--type-table-cell-size)',
                    lineHeight: 'var(--type-body-line)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--color-text-primary)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  },
                  '& .data-table-cell-content, & .data-table-cell-content *': {
                    fontFamily: 'var(--font-ui) !important',
                  },
                  '& .data-table-cell-content': {
                    fontVariantNumeric: 'tabular-nums',
                  },
                  '& .data-table-cell-content p': {
                    margin: 0,
                    fontSize: 'var(--type-table-cell-size) !important',
                    lineHeight: 'var(--type-body-line) !important',
                    fontWeight: 'var(--font-weight-medium) !important',
                    color: 'var(--color-text-primary) !important',
                    backgroundColor: 'transparent !important',
                    border: '0 !important',
                    borderRadius: '0 !important',
                    padding: '0 !important',
                  },
                  '& .data-table-cell-content p + p': {
                    marginTop: '2px',
                    fontSize: 'var(--type-meta-size) !important',
                    lineHeight: 'var(--type-compact-line) !important',
                    fontWeight: 'var(--font-weight-regular) !important',
                    color: 'var(--color-text-secondary) !important',
                  },
                  '& .data-table-cell-content code': {
                    fontSize: 'inherit !important',
                    fontWeight: 'var(--font-weight-medium) !important',
                    color: 'var(--color-text-primary) !important',
                  },
                  '& .data-table-cell-content svg': {
                    color: 'var(--color-text-secondary) !important',
                  },
                }}
                aria-label={t('Records table')}
              >
                <TableHead>
                  <TableRow>
                    {selectable && (
                      <TableCell padding="checkbox" align="center">
                        <MuiCheckbox
                          size="small"
                          checked={allSelected}
                          indeterminate={partiallySelected}
                          onChange={handleSelectAll}
                          inputProps={{ 'aria-label': t('Select all records') }}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const activeSort = sortConfig.key === column.key;
                      const sortable = column.sortable !== false && column.key !== 'actions';
                      return (
                        <TableCell
                          key={column.key}
                          sortDirection={activeSort ? sortConfig.direction : false}
                          align={column.align || (column.key === 'actions' ? 'right' : 'left')}
                          sx={{
                            width: column.width,
                            minWidth: column.minWidth ?? column.width,
                            ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                            ...(column.width ? { flexShrink: 0 } : {}),
                          }}
                        >
                          {sortable ? (
                            <TableSortLabel
                              active={activeSort}
                              direction={activeSort ? sortConfig.direction : 'asc'}
                              onClick={() => handleSort(column.key)}
                            >
                              <p>{t(column.title)}</p>
                            </TableSortLabel>
                          ) : (
                            <p>{t(column.title)}</p>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleData.map((row, index) => {
                    const key = row[keyField] ?? index;
                    const selected = selectedKeys.includes(key);

                    return (
                      <TableRow
                        hover
                        key={key}
                        selected={selected}
                        tabIndex={onRowClick ? 0 : undefined}
                        onClick={(event) => {
                          if (!onRowClick) return;
                          if (event.target.closest?.('button, a, input, select, textarea, [role="button"], [role="checkbox"], [role="link"]')) return;
                          onRowClick(row);
                        }}
                        onKeyDown={(event) => {
                          if (!onRowClick || event.target !== event.currentTarget) return;
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }}
                        sx={{
                          cursor: onRowClick ? 'pointer' : 'default',
                          '&:focus-visible': onRowClick ? {
                            outline: '2px solid var(--color-primary)',
                            outlineOffset: '-2px',
                          } : undefined,
                          '&:last-child td, &:last-child th': { borderBottom: 0 },
                        }}
                      >
                        {selectable && (
                          <TableCell
                            padding="checkbox"
                            align="center"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MuiCheckbox
                              size="small"
                              checked={selected}
                              onChange={() => handleSelectRow(key)}
                              inputProps={{ 'aria-label': t('Select record') }}
                            />
                          </TableCell>
                        )}

                        {columns.map((column) => {
                          const cellValue = row[column.key];
                          return (
                            <TableCell
                              key={column.key}
                              align={column.align || (column.key === 'actions' ? 'right' : 'left')}
                              onClick={column.key === 'actions' ? (event) => event.stopPropagation() : undefined}
                              sx={{
                                width: column.width,
                                minWidth: column.minWidth ?? column.width,
                                ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                                ...(column.key === 'actions' ? {
                                  '& .neir-action-button': {
                                    height: '36px !important',
                                    minHeight: '36px !important',
                                    paddingLeft: '12px !important',
                                    paddingRight: '12px !important',
                                  },
                                } : {}),
                              }}
                              className=""
                            >
                              {['actions', 'status', 'priority', 'method', 'validation'].includes(column.key)
                                ? (column.render
                                  ? column.render(cellValue, row, index)
                                  : <SafeText value={cellValue} mode={column.truncate || 'normal'} />)
                                : (
                                  <div className="data-table-cell-content">
                                    {column.render
                                      ? column.render(cellValue, row, index)
                                      : <SafeText value={cellValue} mode={column.truncate || 'normal'} />}
                                  </div>
                                )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

      {!isLoading && !isError && pagination && effectiveTotalItems > 0 && (
        <MuiTablePagination
          component="div"
          count={effectiveTotalItems}
          page={Math.max(0, Math.min(effectivePage - 1, effectiveTotalPages - 1))}
          rowsPerPage={effectivePageSize}
          rowsPerPageOptions={pageSizeOptions}
          onPageChange={(_, nextPage) => {
            if (usesControlledPagination) {
              onPageChange?.(nextPage + 1);
            } else {
              setInternalPage(nextPage + 1);
            }
          }}
          onRowsPerPageChange={(event) => {
            const nextSize = Number(event.target.value);
            if (usesControlledPagination) {
              onPageSizeChange?.(nextSize);
            } else {
              setInternalPageSize(nextSize);
              setInternalPage(1);
            }
          }}
          labelRowsPerPage={t('Rows per page:')}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('of')} ${count}`}
          showFirstButton={false}
          showLastButton={false}
          sx={{
            fontFamily: 'var(--font-ui)',
            color: 'var(--color-text-secondary)',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--type-body-sm-size)',
            },
            ...(renderMobileCard ? {
              '@media (max-width: 1023px)': {
                display: 'none',
              },
            } : {}),
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            flexShrink: 0,
            '& .MuiTablePagination-toolbar': {
              minHeight: '48px',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingLeft: '16px',
              paddingRight: '12px',
            },
            '& .MuiTablePagination-spacer': {
              display: 'none',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              whiteSpace: 'nowrap',
            },
          }}
        />
      )}
    </div>
  );
};
