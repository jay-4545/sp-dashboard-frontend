'use client';

import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface TopSKUsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function TopSKUs({ data, isLoading }: TopSKUsProps) {
  const skus = data?.topSkus || [];

  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle2"  gutterBottom sx={{ fontWeight: 600 }}>
        Top SKUs
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={40} />
          ))}
        </Box>
      ) : skus.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No SKU data available
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {skus.map((sku, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'grey.50',
                borderRadius: 1,
                px: 1.5,
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body2"   sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {sku.sku || '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {sku.asin}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2"  sx={{ fontWeight: 600 }}>
                  {formatCurrency(sku.totalRevenue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(sku.totalQty)} units
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
