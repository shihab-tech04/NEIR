import React, { useId } from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
} from '@mui/material';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const Checkbox = ({
  label,
  id,
  name,
  checked = false,
  onChange,
  disabled = false,
  description,
  indeterminate = false,
  ariaLabel,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const { t } = usePreferences();

  const control = (
    <MuiCheckbox
      id={inputId}
      name={name}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      disabled={disabled}
      size="small"
      inputProps={{ 'aria-label': ariaLabel ? t(ariaLabel) : undefined }}
      sx={{
        color: 'var(--color-border-strong)',
        padding: '4px',
        '& .MuiSvgIcon-root': { fontSize: 20 },
        '&.Mui-checked': { color: 'var(--color-primary)' },
        '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' },
        '&.Mui-focusVisible': {
          outline: '2px solid var(--color-primary)',
          outlineOffset: '2px',
          borderRadius: 'var(--radius-sm)',
        },
      }}
    />
  );

  if (!label && !description) {
    return <div className={className}>{control}</div>;
  }

  return (
    <FormControlLabel
      className={className}
      disabled={disabled}
      control={control}
      label={
        <div className="flex flex-col">
          {label && <p className="type-label text-[var(--color-text-primary)]">{t(label)}</p>}
          {description && <p className="type-meta text-[var(--color-text-muted)] mt-0.5">{t(description)}</p>}
        </div>
      }
      sx={{
        margin: 0,
        alignItems: 'flex-start',
        gap: '6px',
        '& .MuiFormControlLabel-label': { paddingTop: '3px' },
      }}
    />
  );
};

export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  orientation = 'horizontal',
  variant = 'default',
  disabled = false,
  className = '',
}) => {
  const { t } = usePreferences();

  return (
    <FormControl component="fieldset" disabled={disabled} className={className}>
      {label && (
        <FormLabel
          component="legend"
          sx={{
            fontSize: 'var(--type-label-size)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            mb: 1,
            '&.Mui-focused': { color: 'var(--color-text-primary)' },
          }}
        >
          {t(label)}
        </FormLabel>
      )}
      <MuiRadioGroup
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        row={variant === 'cards' ? false : orientation === 'horizontal'}
        sx={
          variant === 'cards'
            ? {
                display: 'grid',
                gridTemplateColumns: orientation === 'horizontal'
                  ? { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }
                  : '1fr',
                gap: 1,
              }
            : { gap: orientation === 'horizontal' ? 2 : 0.5 }
        }
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                size="small"
                sx={{
                  color: 'var(--color-border-strong)',
                  '&.Mui-checked': { color: 'var(--color-primary)' },
                }}
              />
            }
            label={
              <div className="flex flex-col">
                <p className="type-label text-[var(--color-text-primary)]">{t(option.label)}</p>
                {option.description && <p className="type-meta text-[var(--color-text-muted)] mt-0.5">{t(option.description)}</p>}
              </div>
            }
            sx={
              variant === 'cards'
                ? {
                    margin: 0,
                    minHeight: 52,
                    px: 1.25,
                    py: 0.75,
                    border: '1px solid',
                    borderColor: value === option.value ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: value === option.value ? 'var(--color-primary-alpha-8)' : 'var(--color-surface)',
                    borderRadius: 'var(--field-radius)',
                    transition: 'background-color var(--motion-fast), border-color var(--motion-fast)',
                    '&:hover': {
                      backgroundColor: value === option.value
                        ? 'var(--color-primary-alpha-8)'
                        : 'var(--color-background-subtle)',
                    },
                  }
                : {
                    margin: 0,
                    minHeight: 44,
                    px: 1,
                    py: 0.5,
                    borderRadius: 'var(--radius-md)',
                    transition: 'background-color var(--motion-fast)',
                    '&:hover': { backgroundColor: 'var(--color-background-subtle)' },
                  }
            }
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
};
