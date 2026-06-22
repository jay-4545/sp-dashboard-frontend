'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e293b' },
    secondary: { main: '#3b82f6' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'inherit',
    fontSize: 13,
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.6875rem' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { size: 'small' },
      styleOverrides: { root: { textTransform: 'none', fontSize: '0.8125rem' } },
    },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase' },
        body: { fontSize: '0.8125rem' },
      },
    },
    MuiChip: { styleOverrides: { label: { fontSize: '0.6875rem' } } },
  },
});

export default theme;
