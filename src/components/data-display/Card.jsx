import React from 'react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Card = ({
  children, title, subtitle, headerAction, footer, className = '', bodyClassName = 'p-5', noPadding = false,
}) => {
  const { t } = usePreferences();
  return (
    <div className={'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden ' + className}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4 bg-[var(--color-surface)]">
          <div className="min-w-0">
            {title && <h3 className="type-card-title text-[var(--color-text-primary)]">{t(title)}</h3>}
            {subtitle && <p className="type-body-sm text-[var(--color-text-secondary)] mt-0.5">{t(subtitle)}</p>}
          </div>
          {headerAction && <div className="flex items-center gap-2 shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
      {footer && <div className="px-5 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex items-center justify-between">{footer}</div>}
    </div>
  );
};

export const Section = ({ title, description, children, action, className = '' }) => {
  const { t } = usePreferences();
  return (
    <section className={'flex flex-col gap-3 ' + className}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h4 className="type-card-title text-[var(--color-text-primary)]">{t(title)}</h4>}
            {description && <p className="type-body-sm text-[var(--color-text-secondary)] mt-0.5">{t(description)}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};
