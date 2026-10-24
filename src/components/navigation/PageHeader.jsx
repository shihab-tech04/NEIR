import React from 'react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const PageHeader = ({ title, description, actions, className = '' }) => {
  const { t } = usePreferences();

  return (
    <header className={'pb-4 mb-5 border-b border-[var(--color-border)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 ' + className}>
      <div className="min-w-0">
        <h1 className="type-page-title text-[var(--color-text-primary)]">{t(title)}</h1>
        {description && <p className="type-body text-[var(--color-text-secondary)] mt-1 max-w-3xl">{t(description)}</p>}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 self-start lg:self-center max-md:[&>button]:w-full">
          {actions}
        </div>
      )}
    </header>
  );
};
