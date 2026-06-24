'use client';

import { Box, Typography } from '@mui/material';

interface SectionHeadingProps {
  overline: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeading({ overline, title, subtitle, align = 'center', light }: SectionHeadingProps) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 5 } }}>
      <Typography
        variant="overline"
        sx={{
          color: light ? 'rgba(255,255,255,0.6)' : 'secondary.main',
          display: 'block',
          mb: 1,
        }}
      >
        {overline}
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          color: light ? '#fff' : 'text.primary',
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: light ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            maxWidth: align === 'center' ? 560 : undefined,
            mx: align === 'center' ? 'auto' : undefined,
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
