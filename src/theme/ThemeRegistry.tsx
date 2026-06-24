'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { DateLocalizationProvider } from './DateLocalizationProvider';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <DateLocalizationProvider>
          <CssBaseline />
          {children}
        </DateLocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
