import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldAlert, Ban, Activity, HelpCircle } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const StatusBadge = ({ status = 'Active', showIcon = true, size = 'md', plain = false, className = '' }) => {
  const { t } = usePreferences();
  const norm = (status || '').toLowerCase().trim();
  let config = { bg: 'bg-[var(--color-background)]', text: 'text-[var(--color-text-secondary)]', border: 'border-[var(--color-border)]', icon: HelpCircle };

  if (norm.includes('approved') || norm.includes('accepted') || norm === 'white listed' || norm === 'found' || norm === 'active' || norm.includes('resolved')) {
    config = { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', border: 'border-[var(--color-success-border)]', icon: CheckCircle2 };
  } else if (norm.includes('pending') || norm === 'in queue' || norm.includes('lost') || norm.includes('stolen')) {
    config = { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning-text)]', border: 'border-[var(--color-warning-border)]', icon: norm.includes('lost') || norm.includes('stolen') ? ShieldAlert : Clock };
  } else if (norm.includes('progress') || norm.includes('review') || norm.includes('gray')) {
    config = { bg: 'bg-[var(--color-info-bg)]', text: 'text-[var(--color-primary-dark)]', border: 'border-[var(--color-info-border)]', icon: Activity };
  } else if (norm.includes('rejected') || norm.includes('denied') || norm.includes('failed') || norm.includes('blocked') || norm.includes('black list')) {
    config = { bg: 'bg-[var(--color-error-bg)]', text: 'text-[var(--color-error)]', border: 'border-[var(--color-error-border)]', icon: norm.includes('blocked') || norm.includes('black') ? Ban : XCircle };
  }

  const Icon = config.icon;
  const sizeClasses = plain
    ? (size === 'sm' ? 'type-body-sm gap-1' : 'type-body gap-1.5')
    : (size === 'sm' ? 'type-badge px-2 py-1 gap-1' : 'type-badge px-2.5 py-1 gap-1.5');

  return (
    <div className={'inline-flex items-center font-semibold leading-none shrink-0 ' +
      (plain ? '' : 'rounded-full border ' + config.bg + ' ' + config.border + ' ') +
      config.text + ' ' + sizeClasses + ' ' + className}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <p>{t(status)}</p>
    </div>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const { t } = usePreferences();
  const norm = (priority || '').toLowerCase();
  const colors = {
    high: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]',
    urgent: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]',
    medium: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]',
    low: 'bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
  };
  return <p className={'px-2 py-1 rounded-full type-badge border ' + (colors[norm] || colors.medium)}>{t(priority)}</p>;
};

export const MetricCard = ({ title, value, change, category, tone = 'neutral', icon: Icon, compact = false, className = '' }) => {
  const { t } = usePreferences();
  const tones = {
    success: { dot: 'bg-[var(--color-success)]', iconBg: 'bg-[var(--color-success-bg)]', iconText: 'text-[var(--color-success)]' },
    warning: { dot: 'bg-[var(--color-warning)]', iconBg: 'bg-[var(--color-warning-bg)]', iconText: 'text-[var(--color-warning-text)]' },
    danger: { dot: 'bg-[var(--color-error)]', iconBg: 'bg-[var(--color-error-bg)]', iconText: 'text-[var(--color-error)]' },
    info: { dot: 'bg-[var(--color-primary)]', iconBg: 'bg-[var(--color-info-bg)]', iconText: 'text-[var(--color-primary-dark)]' },
    neutral: { dot: 'bg-[var(--color-text-muted)]', iconBg: 'bg-[var(--color-background-subtle)]', iconText: 'text-[var(--color-text-secondary)]' },
  };
  const toneConfig = tones[tone] || tones.neutral;

  if (compact) {
    return (
      <div className={'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-5 min-h-[110px] flex items-center ' + className}>
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="min-w-0 flex-1">
            <p className="type-kpi text-[var(--color-text-primary)]">{value}</p>
            <p className="type-label text-[var(--color-text-secondary)] mt-2">{t(title)}</p>
            {(change || category) && (
              <div className="flex flex-wrap items-center gap-x-1 type-meta text-[var(--color-text-muted)] mt-1">
                {change ? <p className="font-medium">{change}</p> : null}
                {change && category ? <p aria-hidden="true">·</p> : null}
                {category ? <p>{t(category)}</p> : null}
              </div>
            )}
          </div>
          {Icon && (
            <div className={'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ' + toneConfig.iconBg}>
              <Icon className={'w-5 h-5 ' + toneConfig.iconText} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 min-h-[116px] shadow-[var(--shadow-sm)] flex flex-col justify-between transition-shadow hover:shadow-[var(--shadow-md)] ' + className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className={'w-2 h-2 rounded-full shrink-0 ' + toneConfig.dot} />
            <p className="type-label text-[var(--color-text-secondary)]">{t(title)}</p>
          </div>
          <p className="type-kpi text-[var(--color-text-primary)] mt-3">{value}</p>
        </div>
        {Icon && <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + toneConfig.iconBg}><Icon className={'w-5 h-5 ' + toneConfig.iconText} /></div>}
      </div>
      {(change || category) && (
        <div className="flex items-start justify-between gap-3 type-meta text-[var(--color-text-muted)] mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]">
          <p className="font-medium leading-4">{change}</p>
          {category && <p className="shrink-0 text-right">{t(category)}</p>}
        </div>
      )}
    </div>
  );
};
