'use client';

import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { Box } from '@mui/material';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <MarketingNav />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <MarketingFooter />
    </Box>
  );
}
