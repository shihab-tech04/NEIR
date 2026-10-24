import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const { t } = usePreferences();
  const configs = {
    info: {
      bg: 'bg-[var(--color-info-bg)]',
      border: 'border-[var(--color-info-border)]',
      icon: Info,
      iconColor: 'text-[var(--color-primary-dark)]',
    },
    success: {
      bg: 'bg-[var(--color-success-bg)]',
      border: 'border-[var(--color-success-border)]',
      icon: CheckCircle2,
      iconColor: 'text-[var(--color-success)]',
    },
    warning: {
      bg: 'bg-[var(--color-warning-bg)]',
      border: 'border-[var(--color-warning-border)]',
      icon: AlertTriangle,
      iconColor: 'text-[var(--color-warning)]',
    },
    danger: {
      bg: 'bg-[var(--color-error-bg)]',
      border: 'border-[var(--color-error-border)]',
      icon: AlertCircle,
      iconColor: 'text-[var(--color-error)]',
    },
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={'p-3.5 rounded-[var(--radius-lg)] border flex items-start gap-3 ' + config.bg + ' ' + config.border + ' ' + className}
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      <Icon className={'w-5 h-5 shrink-0 mt-0.5 ' + config.iconColor} />
      <div className="flex-1 min-w-0">
        {title && <h4 className="type-label font-semibold text-[var(--color-text-primary)]">{t(title)}</h4>}
        {typeof children === 'string'
          ? <p className="type-meta text-[var(--color-text-secondary)] mt-1">{t(children)}</p>
          : <div className="type-meta text-[var(--color-text-secondary)] mt-1">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 -m-1.5 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
          aria-label={t('Close')}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
