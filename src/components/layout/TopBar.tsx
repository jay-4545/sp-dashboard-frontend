'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { clearToken, getRefreshToken } from '@/lib/auth';
import api from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import { AccountSelector } from '@/components/shared/AccountSelector';
import { SyncStatus } from '@/components/shared/SyncStatus';
import { DateRangePicker } from '@/components/shared/DateRangePicker';
import { DRAWER_WIDTH } from './constants';

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
  showFilters?: boolean;
}

export function TopBar({ onMenuClick, title, showFilters = true }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await api.post('/api/auth/logout', { refreshToken });
    } catch {
      // proceed with local logout
    }
    clearToken();
    useUserStore.getState().setUser(null);
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { lg: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48, flexWrap: 'wrap', py: 0.5 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { lg: 'none' } }} size="small">
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography variant="subtitle1"  sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          {showFilters && (
            <>
              <AccountSelector />
              <DateRangePicker />
            </>
          )}
          <SyncStatus />
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Logout
          </Button>
          <IconButton onClick={handleLogout} size="small" sx={{ display: { sm: 'none' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
