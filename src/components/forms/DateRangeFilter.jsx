import React, { useMemo, useState } from 'react';
import { Popover, IconButton, useMediaQuery } from '@mui/material';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const pad = (value) => String(value).padStart(2, '0');

const parseIsoDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toIsoDate = (date) =>
  date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '';

const formatDisplayDate = (value) => {
  const date = parseIsoDate(value);
  if (!date) return '';
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date, amount) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const sameDay = (left, right) =>
  Boolean(left && right) &&
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isBefore = (left, right) =>
  Boolean(left && right) && left.getTime() < right.getTime();

const isAfter = (left, right) =>
  Boolean(left && right) && left.getTime() > right.getTime();

const monthLabel = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

const buildCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const CalendarMonth = ({ monthDate, startDate, endDate, onSelect, t }) => {
  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <section className="min-w-0 flex-1">
      <h3 className="type-body-strong text-center text-[var(--color-text-primary)] mb-3">
        {monthLabel(monthDate)}
      </h3>

      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((day, index) => (
          <div key={day + index} className="h-8 flex items-center justify-center">
            <p className="type-meta text-[var(--color-text-muted)]">{day}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, index) => {
          if (!date) return <div key={'empty-' + index} className="h-9" />;

          const rangeStart = sameDay(date, startDate);
          const rangeEnd = sameDay(date, endDate);
          const inRange =
            startDate &&
            endDate &&
            !rangeStart &&
            !rangeEnd &&
            isAfter(date, startDate) &&
            isBefore(date, endDate);

          const selected = rangeStart || rangeEnd;
          const stateClasses = selected
            ? 'bg-[var(--color-primary)] text-white font-semibold rounded-full'
            : inRange
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] rounded-full';

          return (
            <button
              key={toIsoDate(date)}
              type="button"
              onClick={() => onSelect(date)}
              aria-label={new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date)}
              aria-pressed={selected}
              className={'h-9 min-w-9 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-1 ' + stateClasses}
            >
              <p className="type-meta">{date.getDate()}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export const DateRangeFilter = ({
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  compact = false,
  buttonLabel = 'Filter by Date',
  className = '',
}) => {
  const { t } = usePreferences();
  const showTwoMonths = useMediaQuery('(min-width:768px)');
  const isMobile = useMediaQuery('(max-width:767px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const parsedStart = useMemo(() => parseIsoDate(startDate), [startDate]);
  const parsedEnd = useMemo(() => parseIsoDate(endDate), [endDate]);

  const initialMonth = parsedStart || parsedEnd || new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(initialMonth));

  const open = Boolean(anchorEl);

  const openFilter = (event) => {
    setAnchorEl(event.currentTarget);
    const nextField = parsedStart && !parsedEnd ? 'end' : 'start';
    setActiveField(nextField);
    setVisibleMonth(startOfMonth((nextField === 'end' ? parsedEnd || parsedStart : parsedStart || parsedEnd) || new Date()));
  };

  const closeFilter = () => {
    setAnchorEl(null);
    setActiveField(null);
  };

  const activateField = (field) => {
    setActiveField(field);
    const selected = field === 'start' ? parsedStart : parsedEnd;
    if (selected) setVisibleMonth(startOfMonth(selected));
  };

  const selectDate = (date) => {
    const iso = toIsoDate(date);

    if (activeField === 'end') {
      if (parsedStart && isBefore(date, parsedStart)) {
        onStartDateChange?.(iso);
        onEndDateChange?.('');
        setActiveField('end');
        return;
      }

      onEndDateChange?.(iso);
      return;
    }

    onStartDateChange?.(iso);
    if (parsedEnd && isAfter(date, parsedEnd)) {
      onEndDateChange?.('');
    }
    setActiveField('end');
  };

  const clearDates = () => {
    onStartDateChange?.('');
    onEndDateChange?.('');
    setActiveField(null);
  };

  const selectionLabel =
    startDate && endDate
      ? `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`
      : startDate || endDate
        ? formatDisplayDate(startDate || endDate)
        : '';

  return (
    <>
      <Button
        variant="outline"
        size={compact ? 'compact' : 'standard'}
        icon={CalendarDays}
        onClick={openFilter}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-pressed={open}
        aria-label={selectionLabel ? `${t('Filter by Date')}: ${selectionLabel}` : t('Filter by Date')}
        className={(open ? 'date-filter-trigger-pressed ' : '') + (compact ? 'px-3 ' : '') + className}
      >
        {buttonLabel}
      </Button>

      <Popover
        open={open}
        transitionDuration={{ enter: 240, exit: 180 }}
        anchorEl={anchorEl}
        anchorReference={isMobile ? 'none' : 'anchorEl'}
        onClose={closeFilter}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            className: 'mobile-bottom-sheet mobile-bottom-sheet-surface',
            sx: isMobile ? {
              position: 'fixed !important',
              left: '0 !important',
              right: '0 !important',
              bottom: '0 !important',
              top: 'auto !important',
              transform: 'none !important',
              width: '100vw',
              maxWidth: '100vw',
              maxHeight: '90dvh',
              mt: 0,
              border: '1px solid var(--color-border)',
              borderLeft: 0,
              borderRight: 0,
              borderBottom: 0,
              borderRadius: '20px 20px 0 0',
              boxShadow: 'var(--shadow-overlay)',
              overflowY: 'auto',
              overflowX: 'hidden',
            } : {
              mt: 1,
              width: showTwoMonths ? 680 : 'min(360px, calc(100vw - 24px))',
              maxWidth: 'calc(100vw - 24px)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <div className="bg-[var(--color-surface)]">
          <div className="px-4 py-3.5 border-b border-[var(--color-border)] flex items-start justify-between gap-4">
            <div>
              <p className="type-label font-semibold text-[var(--color-text-primary)]">{t('Filter by Date')}</p>
              <p className="type-meta text-[var(--color-text-secondary)] mt-0.5">
                {t('Choose a single date or date range')}
              </p>
            </div>
            {selectionLabel && (
              <p className="hidden md:block type-meta font-mono text-[var(--color-text-secondary)] mt-0.5">
                {selectionLabel}
              </p>
            )}
          </div>

          <div className="px-4 pt-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
              <button
                type="button"
                onClick={() => activateField('start')}
                aria-pressed={activeField === 'start'}
                className={
                  'date-filter-field text-left px-3 py-2.5 border rounded-[var(--field-radius)] transition-colors min-w-0 ' +
                  (activeField === 'start'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-alpha-6)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]')
                }
              >
                <p className="type-meta text-[var(--color-text-muted)]">{t('Start date')}</p>
                <p className="type-body font-medium text-[var(--color-text-primary)] mt-0.5 truncate">
                  {formatDisplayDate(startDate) || t('Select date')}
                </p>
              </button>

              <div className="flex items-center justify-center px-1 text-[var(--color-text-muted)]" aria-hidden="true">
                <ArrowRight className="w-4 h-4" />
              </div>

              <button
                type="button"
                onClick={() => activateField('end')}
                aria-pressed={activeField === 'end'}
                className={
                  'date-filter-field text-left px-3 py-2.5 border rounded-[var(--field-radius)] transition-colors min-w-0 ' +
                  (activeField === 'end'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-alpha-6)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]')
                }
              >
                <p className="type-meta text-[var(--color-text-muted)]">{t('End date')}</p>
                <p className="type-body font-medium text-[var(--color-text-primary)] mt-0.5 truncate">
                  {formatDisplayDate(endDate) || t('Select date')}
                </p>
              </button>
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <IconButton
                size="small"
                onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
                aria-label={t('Previous month')}
                sx={{
                  width: isMobile ? 44 : 34,
                  height: isMobile ? 44 : 34,
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--field-radius)',
                  color: 'var(--color-text-secondary)',
                  '&:hover': {
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                  },
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </IconButton>

              <p className="type-meta font-medium text-[var(--color-text-secondary)]">
                {activeField === 'end' ? t('Select end date') : t('Select start date')}
              </p>

              <IconButton
                size="small"
                onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
                aria-label={t('Next month')}
                sx={{
                  width: isMobile ? 44 : 34,
                  height: isMobile ? 44 : 34,
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--field-radius)',
                  color: 'var(--color-text-secondary)',
                  '&:hover': {
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                  },
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </IconButton>
            </div>

            <div className={'pb-4 flex gap-5 ' + (showTwoMonths ? 'divide-x divide-[var(--color-border)]' : '')}>
              <CalendarMonth
                monthDate={visibleMonth}
                startDate={parsedStart}
                endDate={parsedEnd}
                onSelect={selectDate}
                t={t}
              />

              {showTwoMonths && (
                <div className="pl-5 flex-1 min-w-0">
                  <CalendarMonth
                    monthDate={addMonths(visibleMonth, 1)}
                    startDate={parsedStart}
                    endDate={parsedEnd}
                    onSelect={selectDate}
                    t={t}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-3 max-md:pb-[max(12px,env(safe-area-inset-bottom))] border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="type-meta text-[var(--color-text-secondary)] truncate">
                {selectionLabel || t('No date selected')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={clearDates}
                  className="type-button-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-2 py-1.5 rounded-[var(--field-radius)]"
                >
                  <p>{t('Clear')}</p>
                </button>
              )}
              <Button variant="primary" onClick={closeFilter}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};
