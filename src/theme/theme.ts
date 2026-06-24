'use client';

import { createTheme } from '@mui/material/styles';
import { fontFamilySans } from './fonts';

/** Compact UI scale — used app-wide (dashboard, filters, tables, forms). */
export const fontSize = {
  micro: '0.625rem',
  xs: '0.6875rem',
  sm: '0.75rem',
  md: '0.8125rem',
  base: '0.875rem',
  lg: '0.9375rem',
  xl: '1rem',
} as const;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e293b', dark: '#0f172a', light: '#334155' },
    secondary: { main: '#3b82f6', dark: '#2563eb', light: '#60a5fa' },
    success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  typography: {
    fontFamily: fontFamilySans,
    htmlFontSize: 16,
    fontSize: 16,
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: fontSize.xl,
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    h6: {
      fontSize: fontSize.lg,
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: fontSize.base,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontSize: fontSize.md,
      fontWeight: 600,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: fontSize.base,
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: fontSize.md,
      fontWeight: 400,
      lineHeight: 1.55,
    },
    caption: {
      fontSize: fontSize.sm,
      fontWeight: 400,
      lineHeight: 1.45,
    },
    overline: {
      fontSize: fontSize.xs,
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: {
      fontSize: fontSize.md,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0',
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '16px',
        },
        body: {
          fontFamily: fontFamilySans,
          fontSize: fontSize.base,
          lineHeight: 1.6,
          color: '#0f172a',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiButton: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: fontSize.md,
          fontWeight: 600,
          borderRadius: 8,
        },
        sizeLarge: {
          fontSize: fontSize.base,
          padding: '8px 20px',
        },
        sizeSmall: {
          fontSize: fontSize.xs,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: fontSize.md,
          fontWeight: 500,
        },
        sizeSmall: {
          fontSize: fontSize.sm,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: fontSize.md,
          fontWeight: 400,
          '&::placeholder': {
            fontSize: fontSize.sm,
            opacity: 0.55,
          },
        },
        inputSizeSmall: {
          fontSize: fontSize.xs,
          paddingTop: 5,
          paddingBottom: 5,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontSize: fontSize.sm },
      },
    },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        select: {
          fontSize: fontSize.xs,
          paddingTop: 5,
          paddingBottom: 5,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: fontSize.xs },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: fontSize.xs,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        body: { fontSize: fontSize.md },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: { fontSize: 'inherit' },
      },
    },
    MuiChip: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: { height: 22 },
        label: { fontSize: fontSize.micro, fontWeight: 500 },
        labelSmall: { fontSize: fontSize.micro },
        iconSmall: { fontSize: 12 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: { fontSize: fontSize.md, lineHeight: 1.5 },
        title: { fontSize: fontSize.md, fontWeight: 600 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: fontSize.base, fontWeight: 600, paddingBottom: 8 },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { fontSize: fontSize.md },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontSize: fontSize.xs, fontWeight: 500 },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { fontSize: fontSize.xs },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        dense: { minHeight: 44 },
      },
    },
  },
});

export default theme;
