'use client';

import { Paper, Typography, Box, SxProps, Theme } from '@mui/material';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
  sx?: SxProps<Theme>;
}

export function SectionCard({ title, subtitle, action, children, noPadding, sx }: SectionCardProps) {
  return (
    <Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden', ...sx }}>
      {(title || action) && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Box>
            {title && (
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ p: noPadding ? 0 : 2 }}>{children}</Box>
    </Paper>
  );
}
