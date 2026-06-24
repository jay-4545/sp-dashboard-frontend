'use client';

import { Chip, CircularProgress, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SyncIcon from '@mui/icons-material/Sync';
import { useSyncStatus } from '@/hooks/useFinance';
import { formatDateTime } from '@/lib/utils';

export function SyncStatus() {
  const { data, isLoading } = useSyncStatus();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CircularProgress size={14} />
        <Typography variant="caption" color="text.secondary">
          Sync...
        </Typography>
      </Box>
    );
  }

  const latestJob = data?.recentJobs?.[0];
  if (!latestJob) {
    return (
      <Chip
        icon={<SyncIcon sx={{ fontSize: 12 }} />}
        label="No syncs yet"
        size="small"
        variant="outlined"
      />
    );
  }

  const config = {
    running: { color: 'info' as const, icon: <SyncIcon sx={{ fontSize: 14 }} /> },
    success: { color: 'success' as const, icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
    failed: { color: 'error' as const, icon: <ErrorIcon sx={{ fontSize: 14 }} /> },
  };

  const { color, icon } = config[latestJob.status] || config.running;

  return (
    <Chip
      icon={icon}
      label={`${latestJob.sync_type} · ${formatDateTime(latestJob.finished_at || latestJob.started_at)}`}
      size="small"
      color={color}
      variant="outlined"
      title={latestJob.error_message || undefined}
      sx={{
        display: { xs: 'none', sm: 'flex' },
        maxWidth: 200,
        '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
      }}
    />
  );
}
