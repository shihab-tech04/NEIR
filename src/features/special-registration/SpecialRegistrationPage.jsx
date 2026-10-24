import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { SpecialRegistrationReviewModal } from './SpecialRegistrationReviewModal.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Eye, Download } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_STATUS_COUNTS = {
  All: 7,
  Pending: 3,
  'In Progress': 1,
  Accepted: 2,
  Rejected: 1,
};

export const SpecialRegistrationPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusCounts, setStatusCounts] = useState(DEFAULT_STATUS_COUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-24');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isMobileFeed = useMediaQuery('(max-width:1023px)');
  const { addToast } = useToast();

  const statusTabs = [
    { id: 'All', label: 'All Applications', count: statusCounts.All ?? 0 },
    { id: 'Pending', label: 'Pending Review', count: statusCounts.Pending ?? 0 },
    { id: 'In Progress', label: 'In Progress', count: statusCounts['In Progress'] ?? 0 },
    { id: 'Accepted', label: 'Accepted', count: statusCounts.Accepted ?? 0 },
    { id: 'Rejected', label: 'Rejected', count: statusCounts.Rejected ?? 0 },
  ];

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getSpecialRegistrations({
        status: statusFilter,
        search: searchTerm,
        fromDate,
        toDate,
        page: isMobileFeed ? 1 : page,
        pageSize: isMobileFeed ? 100 : pageSize,
      });
      setData(res.items);
      setTotal(res.total);
      setStatusCounts(res.statusCounts || DEFAULT_STATUS_COUNTS);
    } catch (err) {
      addToast('Failed to load special registrations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [statusFilter, searchTerm, fromDate, toDate, page, pageSize, isMobileFeed]);

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setIsReviewOpen(true);
  };

  const handleStatusUpdated = () => {
    // Reload from the source so the active status tab, record count and visible cards stay in sync.
    loadRegistrations();
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '48px', maxWidth: '48px', isMono: true, sortable: false },
    {
      key: 'imei',
      title: 'IMEI Number',
      minWidth: '250px',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-secondary)] truncate">{row.brand} {row.model}</p>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Device Category',
      minWidth: '210px',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'requesterName',
      title: 'Requester / NID',
      minWidth: '230px',
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)] font-mono">{row.requesterNid}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '130px',
      minWidth: '130px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      width: '170px',
      minWidth: '170px',
      isMono: true,
      render: (val) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{val}</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '132px',
      minWidth: '132px',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenReview(row)}
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Special Registration"
        breadcrumbs={[
          { label: 'Special Registration' }
        ]}
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => addToast('Exporting Special Registration CSV batch...', 'info')}
          >
            Export List
          </Button>
        }
      />

      <TablePageWorkspace
        title="All Applications"
        count={total}
        tabs={statusTabs}
        activeTab={statusFilter}
        onTabChange={(id) => {
          setStatusFilter(id);
          setPage(1);
          setPageSize(DEFAULT_PAGE_SIZE);
        }}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search applications..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.imei, item.requesterName, item.requesterNid])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPage(1);
                    setPageSize(DEFAULT_PAGE_SIZE);
                  }}
                  dateFilter={
                    <DateRangeFilter
                      compact
                      buttonLabel="Filter by Date"
                      className="shrink-0"
                      startDate={fromDate}
                      endDate={toDate}
                      onStartDateChange={(value) => {
                        setFromDate(value);
                        setPage(1);
                      }}
                      onEndDateChange={(value) => {
                        setToDate(value);
                        setPage(1);
                      }}
                    />
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
                onRowClick={handleOpenReview}
                pagination
                currentPage={page}
                totalPages={Math.ceil(total / pageSize) || 1}
                totalItems={total}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.imei}
                    subtitle={`${row.brand} ${row.model}`}
                    status={row.status}
                    fields={[
                      { label: 'Requester', value: row.requesterName },
                      { label: 'Category', value: row.category },
                      { label: 'Challan No', value: row.customsChallanNo, isMono: true },
                    ]}
                    footerMeta={row.date}
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Large Review Workspace Modal */}
      {selectedItem && (
        <SpecialRegistrationReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedItem(null);
          }}
          registration={selectedItem}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};
