import React from 'react';
import { Inbox, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Adjust your filters or try a different search term.',
  actionLabel,
  onAction,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <div className={'p-8 text-center flex flex-col items-center justify-center max-w-sm mx-auto ' + className}>
      <div className="w-12 h-12 rounded-full bg-[var(--color-background-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="type-card-title text-[var(--color-text-primary)]">{t(title)}</h4>
      <p className="type-meta text-[var(--color-text-secondary)] mt-1">{t(description)}</p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Unable to load data',
  message = 'An operational error occurred while retrieving data from NEIR registry.',
  onRetry,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <div className={'p-6 text-center flex flex-col items-center justify-center border border-[var(--color-error-border)] bg-[var(--color-error-bg)] rounded-[var(--radius-lg)] max-w-md mx-auto my-4 ' + className}>
      <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-error)] mb-2 border border-[var(--color-error-border)]">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="type-card-title text-[var(--color-text-primary)]">{t(title)}</h4>
      <p className="type-meta text-[var(--color-text-secondary)] mt-1 max-w-sm">{t(message)}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon={RefreshCw} className="mt-3.5">
          Try Again
        </Button>
      )}
    </div>
  );
};

export const LoadingState = ({ message = 'Loading NEIR registry records...', className = '' }) => {
  const { t } = usePreferences();

  return (
    <div className={'p-10 flex flex-col items-center justify-center gap-2.5 ' + className}>
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      <p className="type-meta font-medium text-[var(--color-text-secondary)]">{t(message)}</p>
    </div>
  );
};

export const Skeleton = ({ className = 'h-4 w-full', rounded = 'rounded' }) => (
  <div className={'animate-pulse bg-[var(--color-border)] opacity-70 ' + rounded + ' ' + className} />
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="divide-y divide-[var(--color-border)]">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="p-3.5 flex items-center gap-4">
        {Array.from({ length: cols }).map((_, columnIndex) => (
          <Skeleton
            key={columnIndex}
            className={'h-4 ' + (columnIndex === 0 ? 'w-12' : columnIndex === 1 ? 'w-36' : 'flex-1')}
          />
        ))}
      </div>
    ))}
  </div>
);
