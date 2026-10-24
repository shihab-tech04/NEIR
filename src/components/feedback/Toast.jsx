import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { t } = usePreferences();

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((previous) => [...previous, { id, message, type }]);
    if (duration > 0) setTimeout(() => setToasts((previous) => previous.filter((item) => item.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((previous) => previous.filter((item) => item.id !== id)), []);

  const configs = {
    success: {
      icon: CheckCircle2,
      tint: 'bg-[var(--color-success-bg)]',
      border: 'border-[var(--color-success-border)]',
      iconColor: 'text-[var(--color-success)]',
    },
    error: {
      icon: AlertCircle,
      tint: 'bg-[var(--color-error-bg)]',
      border: 'border-[var(--color-error-border)]',
      iconColor: 'text-[var(--color-error)]',
    },
    info: {
      icon: Info,
      tint: 'bg-[var(--color-info-bg)]',
      border: 'border-[var(--color-info-border)]',
      iconColor: 'text-[var(--color-primary-dark)]',
    },
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] right-3 left-3 md:bottom-4 md:right-4 md:left-auto z-[70] flex flex-col gap-2 md:max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toastItem) => {
          const config = configs[toastItem.type] || configs.info;
          const Icon = config.icon;

          return (
            <div
              key={toastItem.id}
              className={'pointer-events-auto relative isolate overflow-hidden bg-[var(--color-surface)] p-3.5 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border flex items-start gap-2.5 text-[var(--color-text-primary)] ' + config.border}
              role={toastItem.type === 'error' ? 'alert' : 'status'}
            >
              <span aria-hidden="true" className={'absolute inset-0 z-0 pointer-events-none ' + config.tint} />
              <Icon className={'relative z-10 w-4 h-4 shrink-0 mt-0.5 ' + config.iconColor} />
              <p className="relative z-10 flex-1 min-w-0 type-meta font-medium break-words">{t(toastItem.message)}</p>
              <button
                type="button"
                onClick={() => removeToast(toastItem.id)}
                className="relative z-10 w-11 h-11 md:w-8 md:h-8 -m-2 md:-m-1.5 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors shrink-0"
                aria-label={t('Close')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
