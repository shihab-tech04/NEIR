import React from 'react';
import { Languages, Moon, Sun, Type } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const SegmentedGroup = ({ label, children, columns = 2 }) => (
  <div
    className="grid gap-1 p-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background-subtle)]"
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    role="group"
    aria-label={label}
  >
    {children}
  </div>
);

const segmentClass = (selected) =>
  'min-h-10 rounded-[var(--radius-md)] px-3 type-button-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)] ' +
  (selected
    ? 'bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-[var(--shadow-sm)]'
    : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]');

export const PreferencesPanel = ({ className = '' }) => {
  const { language, setLanguage, textSize, setTextSize, theme, setTheme, t } = usePreferences();

  const languageOptions = [
    { id: 'en', label: 'English' },
    { id: 'bn', label: 'Bangla' },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const sizeOptions = [
    { id: 'compact', label: 'Compact', sampleClass: 'text-[14px]' },
    { id: 'standard', label: 'Standard', sampleClass: 'text-[16px]' },
    { id: 'large', label: 'Large', sampleClass: 'text-[18px]' },
  ];

  return (
    <div className={'w-full md:w-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-[20px] rounded-b-none md:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden max-h-[90dvh] md:max-h-none overflow-y-auto max-md:pb-[max(8px,env(safe-area-inset-bottom))] ' + className}>
      <div className="px-4 py-3.5 border-b border-[var(--color-border)]">
        <p className="type-card-title text-[var(--color-text-primary)]">{t('Display preferences')}</p>
      </div>

      <div className="p-4 space-y-4">
        <section className="space-y-2">
          <div className="flex items-center gap-2 px-0.5">
            <Languages className="w-4 h-4 text-[var(--color-text-muted)]" />
            <p className="type-meta font-semibold text-[var(--color-text-secondary)]">{t('Language')}</p>
          </div>

          <SegmentedGroup label={t('Language')}>
            {languageOptions.map((option) => {
              const selected = language === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLanguage(option.id)}
                  className={segmentClass(selected)}
                  aria-pressed={selected}
                >
                  {t(option.label)}
                </button>
              );
            })}
          </SegmentedGroup>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 px-0.5">
            {theme === 'dark'
              ? <Moon className="w-4 h-4 text-[var(--color-text-muted)]" />
              : <Sun className="w-4 h-4 text-[var(--color-text-muted)]" />}
            <p className="type-meta font-semibold text-[var(--color-text-secondary)]">{t('Theme')}</p>
          </div>

          <SegmentedGroup label={t('Theme')}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const selected = theme === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={segmentClass(selected) + ' flex items-center justify-center gap-2'}
                  aria-pressed={selected}
                >
                  <Icon className="w-4 h-4" />
                  <p>{t(option.label)}</p>
                </button>
              );
            })}
          </SegmentedGroup>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 px-0.5">
            <Type className="w-4 h-4 text-[var(--color-text-muted)]" />
            <p className="type-meta font-semibold text-[var(--color-text-secondary)]">{t('Text size')}</p>
          </div>

          <SegmentedGroup label={t('Text size')} columns={3}>
            {sizeOptions.map((option) => {
              const selected = textSize === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTextSize(option.id)}
                  className={segmentClass(selected) + ' min-h-14 flex flex-col items-center justify-center gap-1 px-2'}
                  aria-pressed={selected}
                >
                  <p className={option.sampleClass + ' font-semibold leading-none'}>A</p>
                  <p className="type-meta font-medium">{t(option.label)}</p>
                </button>
              );
            })}
          </SegmentedGroup>
        </section>
      </div>
    </div>
  );
};
