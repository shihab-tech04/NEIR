import React, { useEffect, useRef } from 'react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const TablePageWorkspace = ({
  title,
  count,
  toolbar,
  tabs = [],
  activeTab,
  onTabChange,
  children,
  className = '',
}) => {
  const { t } = usePreferences();
  const tabsNavRef = useRef(null);
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const firstTab = tabs[0];
  const showActiveContext = activeTabConfig && firstTab && activeTabConfig.id !== firstTab.id;
  const resolvedTitle = showActiveContext ? activeTabConfig.label : title;
  const resolvedCount = showActiveContext && typeof activeTabConfig.count === 'number' ? activeTabConfig.count : count;

  useEffect(() => {
    if (!activeTab || typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const activeButton = tabsNavRef.current?.querySelector('[data-active-tab="true"]');
    activeButton?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [activeTab]);

  return (
    <section className={'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden ' + className}>
      <header className="px-4 sm:px-5 py-3 border-b border-[var(--color-border)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="type-card-title text-[var(--color-text-primary)] truncate">{t(resolvedTitle)}</h2>
          {typeof resolvedCount === 'number' && (
            <p className="inline-flex items-center rounded-full bg-[var(--color-background-subtle)] border border-[var(--color-border)] px-2 py-0.5 type-badge text-[var(--color-text-secondary)] whitespace-nowrap">
              {resolvedCount} {t(resolvedCount === 1 ? 'record' : 'records')}
            </p>
          )}
        </div>

        {toolbar && <div className="min-w-0 xl:max-w-[76%] w-full xl:w-auto">{toolbar}</div>}
      </header>

      {tabs.length > 0 && (
        <nav ref={tabsNavRef} className="border-b border-[var(--color-border)] px-2.5 sm:px-3 overflow-x-auto overscroll-x-contain snap-x snap-proximity scroll-px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={t('Table filters')}>
          <div className="flex items-center gap-1 min-w-max">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  data-active-tab={active ? 'true' : 'false'}
                  aria-current={active ? 'page' : undefined}
                  className={'min-h-11 md:min-h-9 px-3 py-2 type-meta font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap snap-center ' +
                    (active
                      ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-background-subtle)]')}
                >
                  <p>{t(tab.label)}</p>
                  {typeof tab.count === 'number' && (
                    <p className={'min-w-5 h-5 px-1.5 rounded-full inline-flex items-center justify-center type-badge tabular-nums ' +
                      (active ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-background)] text-[var(--color-text-muted)]')}>
                      {tab.count}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <div>{children}</div>
    </section>
  );
};
