import React, { useState } from 'react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const widths = {
  compact: 'max-w-24',
  normal: 'max-w-[min(22vw,260px)]',
  long: 'max-w-[min(38vw,520px)]',
};

export const SafeText = ({
  value,
  mode = 'normal',
  className = '',
  fallback = '—',
}) => {
  const text = value === null || value === undefined || value === '' ? fallback : String(value);

  return (
    <p
      className={'block truncate ' + (widths[mode] || widths.normal) + ' ' + className}
      title={text}
    >
      {text}
    </p>
  );
};

export const ExpandableText = ({
  value,
  collapsedLines = 3,
  className = '',
}) => {
  const { t } = usePreferences();
  const [expanded, setExpanded] = useState(false);
  const text = value === null || value === undefined || value === '' ? '—' : String(value);

  return (
    <div className={className}>
      <p
        className={'type-body-sm text-[var(--color-text-primary)] ' + (!expanded ? 'overflow-hidden' : '')}
        style={!expanded ? { display: '-webkit-box', WebkitLineClamp: collapsedLines, WebkitBoxOrient: 'vertical' } : undefined}
      >
        {text}
      </p>
      {text.length > 140 && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 type-meta font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
        >
          <p>{expanded ? t('Show less') : t('Show more')}</p>
        </button>
      )}
    </div>
  );
};
