'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DRAWER_WIDTH } from '@/components/layout/constants';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/finance': 'Finance',
  '/products': 'Products',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const title = pageTitles[pathname] || 'Dashboard';
  const showFilters = pathname !== '/accounts';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
        }}
      >
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          showFilters={showFilters}
        />
        <Box component="main" sx={{ p: { xs: 2, lg: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
