import React, { useId } from 'react';
import { Autocomplete, ListSubheader, MenuItem, TextField } from '@mui/material';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { muiFieldSx, muiFilterSx } from '../../system/muiFieldSx.js';

const normalizeOptions = (options = []) => options.map((option) =>
  typeof option === 'string' ? { value: option, label: option } : option
);

const selectMenuProps = {
  transitionDuration: { enter: 240, exit: 180 },
  PaperProps: {
    className: 'motion-dropdown-panel mobile-bottom-sheet mobile-bottom-sheet-surface',
    sx: {
      mt: 0.5,
      maxHeight: 304,
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--field-radius)',
      boxShadow: 'var(--shadow-md)',
      backgroundColor: 'var(--color-surface)',
      backgroundImage: 'none',
      '@media (max-width:767px)': {
        position: 'fixed !important',
        top: 'auto !important',
        left: '0 !important',
        right: '0 !important',
        bottom: '0 !important',
        transform: 'none !important',
        width: '100vw !important',
        minWidth: '100vw !important',
        maxWidth: '100vw !important',
        maxHeight: '90dvh',
        mt: 0,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderRadius: '20px 20px 0 0',
        boxShadow: 'var(--shadow-overlay)',
      },
    },
  },
  MenuListProps: {
    sx: {
      py: 0.5,
      '@media (max-width:767px)': {
        py: 0,
        pb: 'max(8px, env(safe-area-inset-bottom))',
      },
    },
  },
};

const standardOptionSx = {
  minHeight: 48,
  px: 2,
  py: 1,
  fontSize: 'var(--field-font-size)',
  lineHeight: 1.45,
  whiteSpace: 'normal',
  '&:hover': {
    backgroundColor: 'var(--color-surface-hover)',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontWeight: 600,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'var(--color-primary-light)',
  },
};

export const Select = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select option', error, helperText,
  required = false, disabled = false, readOnly = false, density = 'standard', className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const selectId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const hasKnownValue = value === null || value === undefined || value === '' ||
    normalizedOptions.some((option) => option.value === value);
  const renderedOptions = hasKnownValue
    ? normalizedOptions
    : [{ value, label: String(value), disabled: true }, ...normalizedOptions];
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);
  const fieldSx = density === 'compact' ? muiFilterSx : muiFieldSx;
  const optionSx = density === 'compact'
    ? {
        ...standardOptionSx,
        minHeight: 40,
        py: 0.75,
        fontSize: 'var(--type-control-size)',
        '@media (max-width:767px)': { minHeight: 44 },
      }
    : standardOptionSx;
  const menuProps = {
    ...selectMenuProps,
    MenuListProps: {
      ...selectMenuProps.MenuListProps,
      subheader: fieldLabel ? (
        <ListSubheader
          component="div"
          className="mobile-select-sheet-title"
          sx={{
            display: 'none',
            '@media (max-width:767px)': {
              display: 'flex',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              minHeight: 48,
              alignItems: 'center',
              px: 2,
              py: 1.25,
              bgcolor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border)',
              lineHeight: 1.4,
            },
          }}
        >
          <p className="type-label font-semibold">{fieldLabel}</p>
        </ListSubheader>
      ) : undefined,
    },
  };

  return (
    <div className={className}>
      <TextField
        id={selectId}
        name={name}
        select
        label={fieldLabel}
        value={value ?? ''}
        onChange={onChange}
        error={Boolean(error)}
        helperText={supportingText}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="medium"
        fullWidth
        InputLabelProps={undefined}
        SelectProps={{
          displayEmpty: !fieldLabel,
          readOnly,
          MenuProps: menuProps,
          inputProps: {
            'aria-invalid': Boolean(error) || undefined,
            'aria-describedby': supportingText ? selectId + '-helper' : undefined,
          },
        }}
        FormHelperTextProps={{ id: selectId + '-helper' }}
        sx={fieldSx}
        {...props}
      >
        {placeholder && !value && (
          <MenuItem value="" disabled={required} sx={optionSx}>
            <p className="text-[var(--color-text-muted)]">{t(placeholder)}</p>
          </MenuItem>
        )}
        {renderedOptions.map((option) => (
          <MenuItem key={option.value} value={option.value} disabled={Boolean(option.disabled)} sx={optionSx}>
            {t(option.label)}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export const SearchableSelect = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select or search...', error, helperText,
  required = false, disabled = false, readOnly = false, density = 'standard', className = '',
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const selectedOptionFromList = normalizedOptions.find((option) => option.value === value) || null;
  const fallbackSelectedOption = value !== null && value !== undefined && value !== ''
    ? { value, label: String(value), disabled: true }
    : null;
  const selectedOption = selectedOptionFromList || fallbackSelectedOption;
  const autocompleteOptions = selectedOptionFromList || !fallbackSelectedOption
    ? normalizedOptions
    : [fallbackSelectedOption, ...normalizedOptions];
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);
  const fieldSx = density === 'compact' ? muiFilterSx : muiFieldSx;
  const optionSx = density === 'compact'
    ? {
        ...standardOptionSx,
        minHeight: 40,
        py: 0.75,
        fontSize: 'var(--type-control-size)',
        '@media (max-width:767px)': { minHeight: 44 },
      }
    : standardOptionSx;

  return (
    <div className={className}>
      <Autocomplete
        id={inputId}
        options={autocompleteOptions}
        value={selectedOption}
        onChange={(_, option) => onChange?.(option?.value ?? '')}
        disabled={disabled}
        readOnly={readOnly}
        autoHighlight
        openOnFocus
        getOptionLabel={(option) => t(option.label)}
        isOptionEqualToValue={(option, selected) => option.value === selected.value}
        getOptionDisabled={(option) => Boolean(option.disabled)}
        noOptionsText={t('No options found')}
        slotProps={{
          paper: {
            className: 'motion-dropdown-panel mobile-bottom-sheet mobile-bottom-sheet-surface',
            sx: {
              mt: 0.5,
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--field-radius)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)',
              backgroundImage: 'none',
              '@media (max-width:767px)': {
                mt: 0,
                borderLeft: 0,
                borderRight: 0,
                borderBottom: 0,
                borderRadius: '20px 20px 0 0',
                boxShadow: 'var(--shadow-overlay)',
              },
            },
          },
          listbox: {
            sx: {
              py: 0.5,
              maxHeight: 304,
              '@media (max-width:767px)': {
                maxHeight: '60dvh',
                py: 1,
                pb: 'max(8px, env(safe-area-inset-bottom))',
              },
              '& .MuiAutocomplete-option': optionSx,
            },
          },
          popper: {
            sx: {
              zIndex: 'var(--z-toast)',
              '@media (max-width:767px)': {
                position: 'fixed !important',
                top: 'auto !important',
                left: '0 !important',
                right: '0 !important',
                bottom: '0 !important',
                transform: 'none !important',
                width: '100vw !important',
                minWidth: '100vw !important',
                maxWidth: '100vw !important',
              },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={fieldLabel}
            placeholder={t(placeholder)}
            error={Boolean(error)}
            helperText={supportingText}
            required={required}
            variant="outlined"
            size="medium"
            InputLabelProps={params.InputLabelProps}
            inputProps={{
              ...params.inputProps,
              'aria-invalid': Boolean(error) || undefined,
              'aria-describedby': supportingText ? inputId + '-helper' : undefined,
            }}
            FormHelperTextProps={{ id: inputId + '-helper' }}
            sx={fieldSx}
          />
        )}
      />
    </div>
  );
};


export const CompactSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  ...props
}) => (
  <Select
    value={value}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    density="compact"
    className={className}
    {...props}
  />
);
