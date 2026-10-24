import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { useOverlayPresence } from '../../system/useOverlayPresence.js';

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg', className = '' }) => {
  const { t } = usePreferences();
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const presence = useOverlayPresence(isOpen);

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
      panelRef.current?.querySelector(focusableSelector)?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.();
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = [...panelRef.current.querySelectorAll(focusableSelector)];
        if (!focusables.length) return;
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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (contentRef.current) contentRef.current.scrollTop = 0;
    });
  }, [isOpen, title, subtitle]);

  if (!presence.mounted) return null;

  return (
    <div data-state={presence.state} className="motion-overlay-backdrop fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-[rgba(32,35,56,0.30)] backdrop-blur-xs" role="presentation">
      <div data-state={presence.state} ref={panelRef} className={'motion-modal-panel mobile-bottom-sheet mobile-bottom-sheet-surface w-full ' + maxWidth + ' bg-[var(--color-surface)] max-md:!max-w-none max-md:h-auto max-md:max-h-[90dvh] max-md:rounded-t-[20px] max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 md:rounded-xl shadow-[var(--shadow-overlay)] border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[90dvh] ' + className} role="dialog" aria-modal="true" aria-label={t(title)}>
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3 bg-[var(--color-surface)] shrink-0">
          <div className="min-w-0">
            <h3 className="type-card-title text-[var(--color-text-primary)]">{t(title)}</h3>
            {subtitle && <p className="type-meta text-[var(--color-text-secondary)] mt-1">{t(subtitle)}</p>}
          </div>
          <button type="button" onClick={onClose} className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)]" aria-label={t('Close modal')}><X className="w-5 h-5" /></button>
        </div>
        <div ref={contentRef} className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0 type-body text-[var(--color-text-primary)]">{children}</div>
        {footer && <div className="px-4 py-3 sm:px-5 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)] flex flex-col md:flex-row md:items-center md:justify-end gap-2.5 shrink-0 max-md:pb-[max(12px,env(safe-area-inset-bottom))] max-md:[&>button]:w-full max-md:[&>div]:w-full">{footer}</div>}
      </div>
    </div>
  );
};

export const ConfirmationDialog = ({
  isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmLabel = 'Confirm', tone = 'danger', isLoading = false,
}) => {
  const { t } = usePreferences();
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-[var(--color-error)]" />,
    warning: <AlertTriangle className="w-6 h-6 text-[var(--color-warning)]" />,
    primary: <Info className="w-6 h-6 text-[var(--color-primary)]" />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className="w-10 h-10 rounded-full bg-[var(--color-background)] flex items-center justify-center shrink-0">{iconMap[tone]}</div>
        <p className="type-body-sm text-[var(--color-text-primary)]">{t(message)}</p>
      </div>
    </Modal>
  );
};
