import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, X } from 'lucide-react';
import { IconButton } from '../forms/Button.jsx';
import { StatusBadge } from '../data-display/StatusBadge.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { useOverlayPresence } from '../../system/useOverlayPresence.js';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';


export const DrawerSection = ({ title, children, defaultOpen = true, trailing = null, className = '' }) => {
  const { t } = usePreferences();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={'border-b border-[var(--color-border)] last:border-b-0 ' + className}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full min-h-11 px-4 py-2.5 flex items-center justify-between gap-3 text-left bg-[var(--color-surface)] hover:bg-[var(--color-background-subtle)] transition-colors"
        aria-expanded={isOpen}
      >
        <p className="type-label font-semibold text-[var(--color-text-primary)]">{t(title)}</p>
        <div className="flex items-center gap-2 shrink-0">
          {trailing}
          <ChevronDown
            className={'w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-[var(--motion-base)] ' + (isOpen ? 'rotate-180' : '')}
          />
        </div>
      </button>
      {isOpen && <div className="px-4 pb-4 pt-1">{children}</div>}
    </section>
  );
};

const useOverlayFocus = (isOpen, onClose, panelRef) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previous = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.();
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = [...panelRef.current.querySelectorAll(focusableSelector)];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen, panelRef]);
};

export const Drawer = ({ isOpen, onClose, onExited, title, subtitle, headerStatus, children, footer, width = 'w-full sm:w-[600px]', className = '' }) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const presence = useOverlayPresence(isOpen, undefined, onExited);
  useOverlayFocus(isOpen, onClose, panelRef);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    });
  }, [isOpen, title, subtitle]);

  if (!presence.mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-stretch lg:justify-end" role="dialog" aria-modal="true" aria-label={t(title || 'Record Details')}>
      <button data-state={presence.state} type="button" onClick={onClose} className="motion-overlay-backdrop absolute inset-0 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" aria-label={t('Close drawer')} />
      <div
        data-state={presence.state}
        ref={panelRef}
        tabIndex={-1}
        className={'motion-drawer-panel focus:outline-none mobile-bottom-sheet mobile-bottom-sheet-surface relative max-lg:!w-full max-lg:max-h-[90dvh] max-lg:rounded-t-[20px] max-sm:border-x-0 max-sm:border-b-0 lg:h-full bg-[var(--color-surface)] shadow-[var(--shadow-overlay)] border border-[var(--color-border)] lg:border-y-0 lg:border-r-0 flex flex-col overflow-hidden ' + width + ' ' + className}
      >
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-start justify-between gap-3 shrink-0">
          <div className="pr-4 min-w-0">
            <h3 className="type-card-title text-[var(--color-text-primary)] truncate">{t(title)}</h3>
            {subtitle && <p className="type-meta text-[var(--color-text-secondary)] mt-1 truncate">{t(subtitle)}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerStatus}
            <IconButton
              icon={X}
              variant="ghost"
              size="md"
              onClick={onClose}
              ariaLabel="Close drawer"
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(1,173,193,0.30)]"
            />
          </div>
        </div>

        <div
          ref={contentRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4"
        >
          {children}
        </div>
        {footer && <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-end gap-2 shrink-0 max-md:pb-[max(12px,env(safe-area-inset-bottom))] max-md:flex-col max-md:items-stretch max-md:[&>button]:w-full max-md:[&>div]:w-full">{footer}</div>}
      </div>
    </div>
  );
};

export const RecordDetailsDrawer = ({
  isOpen, onClose, onExited, title = 'Record Details', recordId, status, sections = [], footerActions, width = 'w-full sm:w-[600px]',
}) => {
  const { t } = usePreferences();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      onExited={onExited}
      title={title}
      subtitle={recordId ? 'ID: ' + recordId : null}
      headerStatus={status ? <StatusBadge status={status} size="md" /> : null}
      width={width}
      footer={footerActions || null}
    >
      <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
        {sections.map((section, index) => (
          <DrawerSection key={section.title || index} title={section.title}>
            <dl className="divide-y divide-[var(--color-border-subtle)]">
              {section.items.map((item, itemIndex) => {
                const displayValue = item.value === null || item.value === undefined || item.value === '' ? '—' : String(item.value);
                return (
                  <div
                    key={item.label || itemIndex}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(155px,0.72fr)_minmax(0,1.28fr)] gap-x-5 gap-y-1 py-2.5 first:pt-1 last:pb-0"
                  >
                    <dt className="type-meta text-[var(--color-text-secondary)]">
                      <p>{t(item.label)}</p>
                    </dt>
                    <dd className={'type-body-sm font-medium text-[var(--color-text-primary)] sm:text-right min-w-0 ' + (item.isMono ? 'font-mono tabular-nums' : '')}>
                      <p className="break-words leading-5" title={displayValue}>{displayValue}</p>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </DrawerSection>
        ))}
      </div>
    </Drawer>
  );
};

export const FullScreenWorkspace = ({
  isOpen,
  onClose,
  title,
  identifier,
  status,
  children,
  footer,
  maxWidth = 'max-w-[92vw]',
  className = '',
  mobileTitle,
  mobileIdentifier,
  onMobileBack,
  hideMobileFooter = false,
  contentRef,
  contentClassName = '',
}) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);
  const internalContentRef = useRef(null);
  const resolvedContentRef = contentRef || internalContentRef;
  const presence = useOverlayPresence(isOpen);
  useOverlayFocus(isOpen, onClose, panelRef);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (resolvedContentRef.current) resolvedContentRef.current.scrollTop = 0;
    });
  }, [isOpen, identifier]);

  if (!presence.mounted) return null;

  return (
    <div data-state={presence.state} className="motion-overlay-backdrop fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" role="dialog" aria-modal="true">
      <div data-state={presence.state} ref={panelRef} className={'motion-modal-panel mobile-bottom-sheet mobile-bottom-sheet-surface w-full ' + maxWidth + ' max-md:!max-w-none max-md:h-auto max-md:max-h-[90dvh] max-md:rounded-t-[20px] max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 md:h-[88vh] md:rounded-xl bg-[var(--color-background)] shadow-[var(--shadow-overlay)] border border-[var(--color-border)] flex flex-col overflow-hidden transition-[max-width] duration-[var(--motion-slow)] ease-out ' + className}>
        <div className="md:hidden px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text-primary)] flex items-center justify-between gap-2 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {onMobileBack && (
              <button
                type="button"
                onClick={onMobileBack}
                className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] shrink-0"
                aria-label={t('Back to review')}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="type-card-title truncate">{t(mobileTitle || title)}</h2>
              {(mobileIdentifier || identifier) && (
                <p className="type-meta text-[var(--color-text-secondary)] mt-1 truncate">
                  {mobileIdentifier || identifier}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!onMobileBack && status && <StatusBadge status={status} size="sm" />}
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]"
              aria-label={t('Close review workspace')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex px-6 py-4 bg-[var(--color-surface)] text-[var(--color-text-primary)] items-start justify-between gap-3 border-b border-[var(--color-border)] shrink-0">
          <h2 className="type-card-title flex flex-wrap items-center gap-2 min-w-0">
            <p className="truncate">{t(title)}</p>
            {identifier && <p className="type-meta font-mono font-normal text-[var(--color-text-secondary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-[var(--radius-sm)]">{identifier}</p>}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            {status && <StatusBadge status={status} size="sm" />}
            <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]" aria-label={t('Close review workspace')}><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={resolvedContentRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className={'min-h-0 md:min-h-full box-border p-4 md:p-6 ' + contentClassName}>
            {children}
          </div>
        </div>
        {footer && <div className={'px-4 py-3 md:px-6 max-md:pb-[max(12px,env(safe-area-inset-bottom))] bg-[var(--color-surface)] border-t border-[var(--color-border)] items-center justify-between shrink-0 max-md:[&>div]:w-full max-md:[&>button]:w-full ' + (hideMobileFooter ? 'hidden md:flex' : 'flex')}>{footer}</div>}
      </div>
    </div>
  );
};
