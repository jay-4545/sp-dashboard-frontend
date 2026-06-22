'use client';

import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface SummaryCardsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

const cards = [
  { label: 'Total Revenue', key: 'revenue', icon: CurrencyRupeeIcon, color: 'success.main', bg: 'success.50' },
  { label: 'Total Orders', key: 'orders', icon: ShoppingCartIcon, color: 'info.main', bg: 'info.50' },
  { label: 'Avg Order Value', key: 'aov', icon: TrendingUpIcon, color: 'secondary.main', bg: 'secondary.50' },
  { label: 'Top SKUs', key: 'skus', icon: InventoryIcon, color: 'warning.main', bg: 'warning.50' },
] as const;

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const values: Record<string, string> = {
    revenue: data ? formatCurrency(data.totalRevenue) : '—',
    orders: data ? formatNumber(data.totalOrders) : '—',
    aov: data && data.totalOrders > 0 ? formatCurrency(data.totalRevenue / data.totalOrders) : '—',
    skus: data ? formatNumber(data.topSkus?.length || 0) : '—',
  };

  return (
    <Grid container spacing={2}>
      {cards.map(({ label, key, icon: Icon, color, bg }) => (
        <Grid key={key} size={{ xs: 12, sm: 6, xl: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Avatar sx={{ bgcolor: bg, color, width: 32, height: 32 }}>
                  <Icon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              {isLoading ? (
                <Skeleton width={80} height={36} sx={{ mt: 1 }} />
              ) : (
                <Typography variant="h5"  sx={{ mt: 1, fontWeight: 700 }}>
                  {values[key]}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
