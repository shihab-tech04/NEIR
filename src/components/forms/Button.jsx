import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

/**
 * Shared NEIR action button.
 *
 * Normal actions use one geometry (padding-based, never fixed-height).
 * Compact is reserved for dense table/inline actions.
 * Legacy sm/md/lg values remain as compatibility aliases while pages migrate:
 *   sm -> compact
 *   md/lg -> standard
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'standard',
  type = 'button',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const { t } = usePreferences();

  const geometry = 'neir-action-button type-button gap-2 rounded-[var(--field-radius)]';

  const neutralSecondaryClasses =
    'bg-[var(--color-surface)] hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]';

  const variantClasses = {
    primary:
      'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-deep)] text-white border border-transparent shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-shadow)]',
    secondary: neutralSecondaryClasses,
    outline: neutralSecondaryClasses,
    danger:
      'bg-[var(--color-error)] hover:bg-[var(--color-error)] active:bg-[var(--color-error)] text-white border border-transparent shadow-[var(--shadow-sm)]',
    dangerOutline:
      'bg-transparent text-[var(--color-error)] border border-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white active:bg-[var(--color-error)] active:text-white',
    ghost:
      'bg-transparent hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] border border-transparent',
  };

  const label = typeof children === 'string' ? t(children) : children;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={
        'inline-flex items-center justify-center transition-colors select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap ' +
        geometry +
        ' ' +
        variantClasses[variant] +
        ' ' +
        className
      }
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <p>{label}</p>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  title,
  ariaLabel,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const { t } = usePreferences();
  const sizeClasses = {
    sm: 'w-8 h-8 p-1 rounded-[var(--field-radius)]',
    md: 'w-11 h-11 md:w-10 md:h-10 p-1.5 rounded-[var(--field-radius)]',
    lg: 'w-11 h-11 p-2 rounded-[var(--field-radius)]',
  };
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-[var(--shadow-sm)]',
    secondary: 'bg-[var(--color-primary-light)] hover:bg-[var(--color-surface-hover)] text-[var(--color-primary-dark)]',
    outline: 'bg-[var(--color-surface)] hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] border border-[var(--color-border)]',
    danger: 'bg-[var(--color-error-bg)] hover:bg-[var(--color-error-bg)] text-[var(--color-error)]',
    ghost: 'bg-transparent hover:bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)]',
  };

  return (
    <button
      type="button"
      title={typeof title === 'string' ? t(title) : title}
      aria-label={t(ariaLabel || title || '')}
      disabled={disabled}
      onClick={onClick}
      className={'inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ' + sizeClasses[size] + ' ' + variantClasses[variant] + ' ' + className}
      {...props}
    >
      <Icon className="w-4 h-4 shrink-0" />
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={'inline-flex items-center rounded-[var(--field-radius)] isolate -space-x-px ' + className}>{children}</div>
);
