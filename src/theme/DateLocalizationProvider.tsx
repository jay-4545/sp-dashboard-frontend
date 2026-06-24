'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function DateLocalizationProvider({ children }: { children: React.ReactNode }) {
  return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
}
