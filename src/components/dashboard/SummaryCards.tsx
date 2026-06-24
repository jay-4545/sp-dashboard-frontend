'use client';

import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReplayIcon from '@mui/icons-material/Replay';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { MetricCard } from '@/components/shared/MetricCard';
import { DashboardSummary, FinancePnl } from '@/types';

interface SummaryCardsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
  pnl?: FinancePnl;
  pnlLoading?: boolean;
}

export function SummaryCards({ data, isLoading, pnl, pnlLoading }: SummaryCardsProps) {
  const currency = data?.currency || pnl?.currency || 'INR';
  const netProfit = pnl?.netProfit ?? 0;
  const revenue = data?.totalRevenue ?? 0;

  const secondary = [
    { key: 'orders', label: 'Total Orders', value: data ? formatNumber(data.totalOrders) : '—', icon: ShoppingCartIcon, color: '#6366f1', bg: '#eef2ff' },
    { key: 'gross', label: 'Gross Profit', value: pnl ? formatCurrency(pnl.grossProfit, currency) : '—', icon: TrendingUpIcon, color: '#0ea5e9', bg: '#e0f2fe', subtitle: pnl ? `${pnl.grossMargin.toFixed(1)}% margin` : undefined },
    { key: 'refunds', label: 'Refunds', value: data ? formatCurrency(data.totalRefunds, currency) : '—', icon: ReplayIcon, color: '#d97706', bg: '#fef3c7' },
    { key: 'cogsLost', label: 'COGS Lost', value: data ? formatCurrency(data.totalCogsLost, currency) : '—', icon: TrendingDownIcon, color: '#dc2626', bg: '#fee2e2', subtitle: 'On returns' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard
            label="TOTAL REVENUE"
            subtitle="Sales in selected date range"
            value={formatCurrency(revenue, currency)}
            icon={CurrencyRupeeIcon}
            iconColor="success.main"
            iconBg="success.50"
            valueColor="success.dark"
            loading={isLoading}
            featured
            positive
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard
            label="NET PROFIT"
            subtitle={pnl?.hasFinanceData ? `${pnl.netMargin.toFixed(1)}% net margin` : 'Sync finance for fee breakdown'}
            value={pnl ? formatCurrency(netProfit, currency) : '—'}
            icon={AccountBalanceWalletIcon}
            iconColor={netProfit >= 0 ? 'primary.main' : 'error.main'}
            iconBg={netProfit >= 0 ? '#e2e8f0' : 'error.50'}
            valueColor={netProfit >= 0 ? 'primary.main' : 'error.dark'}
            loading={pnlLoading}
            featured
            positive={netProfit >= 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1.5}>
        {secondary.map(({ key, label, value, icon, color, bg, subtitle }) => (
          <Grid key={key} size={{ xs: 6, sm: 3 }}>
            <MetricCard
              label={label}
              value={value}
              subtitle={subtitle}
              icon={icon}
              iconColor={color}
              iconBg={bg}
              loading={key === 'gross' ? pnlLoading : isLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
