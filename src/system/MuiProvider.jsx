import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const muiTheme = createTheme({
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 140,
      shorter: 180,
      short: 180,
      standard: 240,
      complex: 320,
      enteringScreen: 240,
      leavingScreen: 180,
    },
  },
  palette: {
    primary: {
      main: '#01ADC1',
      dark: '#028A97',
      light: '#E1F7FB',
      contrastText: '#FFFFFF',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#EF8F22' },
    error: { main: '#C62828' },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202338',
      secondary: '#626981',
    },
    divider: '#E2E5F0',
  },
  typography: {
    fontFamily: "var(--font-ui)",
    htmlFontSize: 16,
    fontSize: 16,
    h1: { fontSize: 'var(--type-page-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    h2: { fontSize: 'var(--type-section-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    h3: { fontSize: 'var(--type-card-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    body1: { fontSize: 'var(--type-body-size)', lineHeight: 'var(--type-body-line)' },
    body2: { fontSize: 'var(--type-body-sm-size)', lineHeight: 'var(--type-body-line)' },
    caption: { fontSize: 'var(--type-meta-size)', lineHeight: 'var(--type-compact-line)' },
    button: {
      fontSize: 'var(--type-control-size)',
      lineHeight: 'var(--type-compact-line)',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 4,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--field-radius)',
          boxShadow: 'var(--shadow-lg)',
        },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 'var(--field-radius)',
          fontSize: 'var(--type-control-size)',
          color: 'var(--color-text-primary)',
          '&:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.07)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
            fontWeight: 600,
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.16)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 'var(--field-height)',
          borderRadius: 'var(--field-radius)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--field-font-size)',
          boxShadow: 'none',
          '&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-text-secondary)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary)',
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-error)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'var(--field-disabled-bg)',
          },
        },
        input: {
          fontSize: 'var(--field-font-size)',
          lineHeight: 1.5,
          '&::placeholder': {
            color: 'var(--color-text-muted)',
          },
        },
        notchedOutline: {
          borderColor: 'var(--color-border-strong, #C8CDD9)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-form-label-size)',
          '&.Mui-focused': { color: 'var(--color-primary-dark)' },
          '&.Mui-error': { color: 'var(--color-error)' },
          '&.Mui-disabled': { color: 'var(--color-text-muted)' },
        },
        asterisk: {
          color: 'var(--color-error)',
          marginLeft: 2,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 14,
          marginRight: 14,
          marginTop: 4,
          fontSize: 'var(--type-helper-size)',
          lineHeight: 'var(--type-compact-line)',
          color: 'var(--color-text-muted)',
          '&.Mui-error': { color: 'var(--color-error)' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'var(--color-text-secondary)' },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--field-radius)',
          boxShadow: 'var(--shadow-md)',
        },
        option: {
          minHeight: 48,
          fontSize: 'var(--field-font-size)',
          '&[aria-selected="true"]': {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--color-border)',
          padding: 4,
          '&.Mui-checked': { color: 'var(--color-primary)' },
          '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' },
          '&:hover': { backgroundColor: 'rgba(1, 173, 193, 0.08)' },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'var(--color-border)',
          '&.Mui-checked': { color: 'var(--color-primary)' },
          '&:hover': { backgroundColor: 'rgba(1, 173, 193, 0.08)' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-cell-size)',
          lineHeight: 'var(--type-body-line)',
          padding: '14px 16px',
        },
        head: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-head-size)',
          fontWeight: 600,
          lineHeight: 'var(--type-compact-line)',
          paddingTop: 13,
          paddingBottom: 13,
          boxShadow: 'inset 0 -1px 0 var(--color-border)',
          zIndex: 2,
        },
        sizeSmall: {
          paddingTop: 9,
          paddingBottom: 9,
        },
        paddingCheckbox: {
          width: 52,
          paddingLeft: 12,
          paddingRight: 8,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.045)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(1, 173, 193, 0.08)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.11)',
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          '&:hover': {
            color: 'var(--color-primary-dark)',
          },
          '&.Mui-active': {
            color: 'var(--color-text-primary)',
          },
          '&.Mui-active .MuiTableSortLabel-icon': {
            color: 'var(--color-text-secondary)',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-cell-size)',
        },
        toolbar: {
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: 8,
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 4,
        },
        spacer: {
          display: 'none',
        },
        selectLabel: {
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-table-cell-size)',
        },
        displayedRows: {
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-table-cell-size)',
          whiteSpace: 'nowrap',
        },
        actions: {
          marginLeft: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        },
      },
    },
  },
});

export function MuiProvider({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
