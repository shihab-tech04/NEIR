const sharedLabelSx = {
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--type-form-label-size)',
  lineHeight: 1.25,
  '&.Mui-focused': {
    color: 'var(--color-primary-dark)',
  },
  '&.Mui-error': {
    color: 'var(--color-error)',
  },
  '&.Mui-disabled': {
    color: 'var(--color-text-muted)',
  },
  '& .MuiFormLabel-asterisk': {
    color: 'var(--color-error)',
    marginLeft: '2px',
  },
};

const sharedHelperSx = {
  marginLeft: '14px',
  marginRight: '14px',
  marginTop: '4px',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--type-helper-size)',
  lineHeight: 1.4,
  '&.Mui-error': {
    color: 'var(--color-error)',
  },
};

const sharedOutlinedRootSx = {
  borderRadius: 'var(--field-radius)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--field-font-size)',
  boxShadow: 'none',
  transition: 'background-color var(--motion-fast), border-color var(--motion-fast)',
  '& fieldset': {
    borderColor: 'var(--color-border-strong)',
    borderWidth: '1px',
    transition: 'border-color var(--motion-fast), border-width var(--motion-fast)',
  },
  '&:hover:not(.Mui-focused):not(.Mui-disabled) fieldset': {
    borderColor: 'var(--color-text-secondary)',
  },
  '&.Mui-focused fieldset': {
    borderColor: 'var(--color-primary) !important',
    borderWidth: '2px !important',
  },
  '&.Mui-error fieldset': {
    borderColor: 'var(--color-error) !important',
  },
  '&.Mui-error.Mui-focused fieldset': {
    borderWidth: '2px !important',
  },
  '&.Mui-disabled': {
    backgroundColor: 'var(--field-disabled-bg)',
    color: 'var(--color-text-muted)',
    '& fieldset': {
      borderColor: 'var(--color-border) !important',
    },
  },
  '&:has(input[readonly]), &:has(textarea[readonly])': {
    backgroundColor: 'var(--field-readonly-bg)',
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-text-primary)',
    fontSize: 'var(--field-font-size)',
    lineHeight: 1.5,
    '&::placeholder': {
      color: 'var(--color-text-muted)',
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: 'var(--color-text-muted)',
    },
    '&[type="search"]::-webkit-search-cancel-button, &[type="search"]::-webkit-search-decoration, &[type="search"]::-webkit-search-results-button, &[type="search"]::-webkit-search-results-decoration': {
      WebkitAppearance: 'none',
      appearance: 'none',
      display: 'none',
    },
  },
  '& .MuiInputAdornment-root': {
    color: 'var(--color-text-muted)',
    '& .MuiSvgIcon-root, & svg': {
      width: 18,
      height: 18,
    },
  },
  '& .MuiSelect-select': {
    fontSize: 'var(--field-font-size)',
  },
};

export const muiFieldSx = {
  '& .MuiInputLabel-root': sharedLabelSx,

  '& .MuiOutlinedInput-root': {
    ...sharedOutlinedRootSx,
    minHeight: 'var(--field-height)',
    height: 'var(--field-height)',
  },

  '& .MuiOutlinedInput-root.MuiInputBase-multiline': {
    height: 'auto',
    minHeight: 'var(--textarea-min-height)',
    alignItems: 'flex-start',
  },

  '& .MuiAutocomplete-inputRoot': {
    minHeight: 'var(--field-height)',
    height: 'var(--field-height)',
    alignItems: 'center',
  },

  '& .MuiFormHelperText-root': sharedHelperSx,
};

export const muiFilterSx = {
  '& .MuiInputLabel-root': {
    ...sharedLabelSx,
    fontSize: 'var(--type-control-size)',
  },

  '& .MuiOutlinedInput-root': {
    ...sharedOutlinedRootSx,
    minHeight: '40px',
    height: '40px',
    '& .MuiOutlinedInput-input': {
      paddingTop: '8.5px',
      paddingBottom: '8.5px',
      fontSize: 'var(--type-control-size)',
    },
    '& .MuiSelect-select': {
      minHeight: 'unset',
      paddingTop: '8.5px',
      paddingBottom: '8.5px',
      fontSize: 'var(--type-control-size)',
    },
  },

  '& .MuiAutocomplete-inputRoot': {
    minHeight: '40px',
    height: '40px',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    alignItems: 'center',
  },

  '& .MuiAutocomplete-input': {
    paddingTop: '8px !important',
    paddingBottom: '8px !important',
    fontSize: 'var(--type-control-size) !important',
  },

  '& .MuiFormHelperText-root': {
    ...sharedHelperSx,
    fontSize: 'var(--type-meta-size)',
  },
};
