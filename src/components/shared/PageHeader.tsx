'use client';

import { Box, Paper, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description?: string;
  formula?: string[];
  action?: React.ReactNode;
  variant?: 'gradient' | 'light';
}

export function PageHeader({
  title,
  description,
  formula,
  action,
  variant = 'gradient',
}: PageHeaderProps) {
  const isGradient = variant === 'gradient';

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2.5,
        py: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 1.5,
        ...(isGradient
          ? {
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: '#fff',
              border: 'none',
            }
          : {
              bgcolor: 'background.paper',
            }),
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isGradient ? '#fff' : 'text.primary' }}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              color: isGradient ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            }}
          >
            {description}
          </Typography>
        )}
        {formula && formula.length > 0 && (
          <Box
            sx={{
              mt: 1.5,
              display: 'inline-flex',
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
              bgcolor: isGradient ? 'rgba(255,255,255,0.1)' : 'grey.50',
              borderRadius: 1,
              px: 1.5,
              py: 0.75,
            }}
          >
            {formula.map((step, i) => (
              <Typography
                key={`${step}-${i}`}
                variant="caption"
                sx={{
                  fontWeight: i === formula.length - 1 ? 700 : 500,
                  color: isGradient
                    ? i === formula.length - 1
                      ? '#86efac'
                      : 'rgba(255,255,255,0.9)'
                    : i === formula.length - 1
                      ? 'success.dark'
                      : 'text.secondary',
                }}
              >
                {step}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Paper>
  );
}
