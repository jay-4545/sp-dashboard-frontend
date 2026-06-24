'use client';

import { Card, CardContent, Typography, Box, Skeleton, Avatar, SxProps, Theme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: SvgIconComponent;
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  loading?: boolean;
  featured?: boolean;
  positive?: boolean;
  sx?: SxProps<Theme>;
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'primary.main',
  iconBg = '#e2e8f0',
  valueColor = 'text.primary',
  loading,
  featured,
  positive,
  sx,
}: MetricCardProps) {
  const featuredBg =
    positive === true
      ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)'
      : positive === false
        ? 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 60%)';

  const featuredBorder =
    positive === true ? 'success.light' : positive === false ? 'error.light' : 'divider';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        ...(featured
          ? {
              background: featuredBg,
              borderColor: featuredBorder,
            }
          : {}),
        ...sx,
      }}
    >
      <CardContent sx={{ py: featured ? 2.5 : 1.75, px: featured ? 2 : 1.75, '&:last-child': { pb: featured ? 2.5 : 1.75 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                letterSpacing: featured ? 0.5 : 0,
                fontWeight: featured ? 600 : 400,
                display: 'block',
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Avatar sx={{ bgcolor: iconBg, color: iconColor, width: featured ? 40 : 28, height: featured ? 40 : 28, flexShrink: 0 }}>
              <Icon sx={{ fontSize: featured ? 20 : 15 }} />
            </Avatar>
          )}
        </Box>
        {loading ? (
          <Skeleton width={featured ? 140 : 80} height={featured ? 44 : 28} sx={{ mt: featured ? 1.5 : 0.75 }} />
        ) : (
          <Typography
            variant={featured ? 'h5' : 'subtitle2'}
            sx={{
              mt: featured ? 1.5 : 0.75,
              fontWeight: featured ? 800 : 700,
              color: valueColor,
            }}
          >
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
