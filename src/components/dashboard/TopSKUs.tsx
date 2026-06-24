'use client';

import { Box, Typography, Skeleton, Avatar } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { SectionCard } from '@/components/shared/SectionCard';
import { DashboardSummary } from '@/types';

interface TopSKUsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

const rankColors = ['#f59e0b', '#94a3b8', '#b45309'];

export function TopSKUs({ data, isLoading }: TopSKUsProps) {
  const skus = data?.topSkus || [];
  const currency = data?.currency || 'INR';

  return (
    <SectionCard title="Top SKUs" subtitle="Best performers by revenue">
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={52} variant="rounded" />
          ))}
        </Box>
      ) : skus.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No SKU data available
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {skus.map((sku, i) => {
            const profit = Number(sku.grossProfit);
            const profitColor = profit >= 0 ? 'success.main' : 'error.main';
            return (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  bgcolor: i === 0 ? 'success.50' : 'grey.50',
                  borderRadius: 1,
                  px: 1.5,
                  py: 1.25,
                  border: 1,
                  borderColor: i === 0 ? 'success.light' : 'transparent',
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    bgcolor: rankColors[i] || 'grey.300',
                    color: '#fff',
                  }}
                >
                  {i < 3 ? <EmojiEventsIcon sx={{ fontSize: 14 }} /> : i + 1}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {sku.sku || '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {sku.asin} · {formatNumber(sku.totalQty)} units
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(sku.totalRevenue, currency)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: profitColor, fontWeight: 600 }}>
                    {formatCurrency(sku.grossProfit, currency)} profit
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </SectionCard>
  );
}
