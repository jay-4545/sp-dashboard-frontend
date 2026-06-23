'use client';

import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary, FinancePnl } from '@/types';

interface SummaryCardsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
  pnl?: FinancePnl;
  pnlLoading?: boolean;
}

const cards = [
  { label: 'Total Revenue', key: 'revenue', icon: CurrencyRupeeIcon, color: 'success.main', bg: 'success.50' },
  { label: 'Net Profit', key: 'netProfit', icon: AccountBalanceWalletIcon, color: 'primary.main', bg: '#e2e8f0', pnlKey: true },
  { label: 'Total Orders', key: 'orders', icon: ShoppingCartIcon, color: 'info.main', bg: 'info.50' },
  { label: 'Avg Order Value', key: 'aov', icon: TrendingUpIcon, color: 'secondary.main', bg: 'secondary.50' },
] as const;

export function SummaryCards({ data, isLoading, pnl, pnlLoading }: SummaryCardsProps) {
  const currency = pnl?.currency || 'INR';
  const values: Record<string, string> = {
    revenue: data ? formatCurrency(data.totalRevenue) : '—',
    netProfit: pnl ? formatCurrency(pnl.netProfit, currency) : '—',
    orders: data ? formatNumber(data.totalOrders) : '—',
    aov: data && data.totalOrders > 0 ? formatCurrency(data.totalRevenue / data.totalOrders) : '—',
  };

  return (
    <Grid container spacing={2}>
      {cards.map(({ label, key, icon: Icon, color, bg, ...rest }) => {
        const fromPnl = 'pnlKey' in rest && rest.pnlKey;
        const loading = fromPnl ? pnlLoading : isLoading;
        const valueColor = key === 'netProfit' && pnl
          ? pnl.netProfit >= 0
            ? 'success.main'
            : 'error.main'
          : color;

        return (
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
                {loading ? (
                  <Skeleton width={80} height={36} sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="h5" color={valueColor} sx={{ mt: 1, fontWeight: 700 }}>
                    {values[key]}
                  </Typography>
                )}
                {key === 'netProfit' && pnl && !pnl.hasFinanceData && !pnlLoading && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Sync finance data for fees
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
