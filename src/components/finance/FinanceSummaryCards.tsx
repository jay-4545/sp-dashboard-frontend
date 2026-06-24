'use client';

import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReplayIcon from '@mui/icons-material/Replay';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { formatCurrency } from '@/lib/utils';
import { MetricCard } from '@/components/shared/MetricCard';
import { FinancePnl } from '@/types';

interface FinanceSummaryCardsProps {
  pnl?: FinancePnl;
  isLoading?: boolean;
}

export function FinanceSummaryCards({ pnl, isLoading }: FinanceSummaryCardsProps) {
  const currency = pnl?.currency || 'INR';
  const netProfit = pnl?.netProfit ?? 0;
  const grossProfit = pnl?.grossProfit ?? 0;

  const secondary = [
    { key: 'revenue', label: 'Gross Revenue', value: formatCurrency(pnl?.totalRevenue ?? 0, currency), icon: CurrencyRupeeIcon, color: '#16a34a', bg: '#dcfce7', subtitle: `${pnl?.orderCount ?? 0} orders` },
    { key: 'cogs', label: 'Product COGS', value: formatCurrency(pnl?.totalCogs ?? 0, currency), icon: TrendingDownIcon, color: '#64748b', bg: '#f1f5f9', subtitle: 'Landed cost sold' },
    { key: 'fees', label: 'Amazon Fees', value: formatCurrency(pnl?.totalFees ?? 0, currency), icon: StorefrontIcon, color: '#d97706', bg: '#fef3c7', subtitle: pnl?.hasFinanceData ? 'From finance sync' : 'Sync finance data' },
    { key: 'refunds', label: 'Refunds', value: formatCurrency(pnl?.totalRefunds ?? 0, currency), icon: ReplayIcon, color: '#dc2626', bg: '#fee2e2' },
    { key: 'cogsLost', label: 'COGS Lost', value: formatCurrency(pnl?.cogsLostOnReturns ?? 0, currency), icon: TrendingDownIcon, color: '#dc2626', bg: '#fee2e2', subtitle: 'Returns inventory' },
    { key: 'events', label: 'Finance Events', value: String(pnl?.eventCount ?? 0), icon: ReceiptLongIcon, color: '#6366f1', bg: '#eef2ff', subtitle: 'Deduped fee lines' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard
            label="NET PROFIT"
            subtitle={pnl ? `${pnl.netMargin.toFixed(1)}% net margin` : 'After fees, refunds & COGS'}
            value={formatCurrency(netProfit, currency)}
            icon={AccountBalanceWalletIcon}
            iconColor={netProfit >= 0 ? 'success.main' : 'error.main'}
            iconBg={netProfit >= 0 ? 'success.50' : 'error.50'}
            valueColor={netProfit >= 0 ? 'success.dark' : 'error.dark'}
            loading={isLoading}
            featured
            positive={netProfit >= 0}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard
            label="GROSS PROFIT"
            subtitle={pnl ? `${pnl.grossMargin.toFixed(1)}% gross margin` : 'Revenue minus COGS'}
            value={formatCurrency(grossProfit, currency)}
            icon={TrendingUpIcon}
            iconColor={grossProfit >= 0 ? 'info.main' : 'error.main'}
            iconBg={grossProfit >= 0 ? 'info.50' : 'error.50'}
            valueColor={grossProfit >= 0 ? 'info.dark' : 'error.dark'}
            loading={isLoading}
            featured
            positive={grossProfit >= 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1.5}>
        {secondary.map(({ key, label, value, icon, color, bg, subtitle }) => (
          <Grid key={key} size={{ xs: 6, sm: 4, lg: 2 }}>
            <MetricCard
              label={label}
              value={value}
              subtitle={subtitle}
              icon={icon}
              iconColor={color}
              iconBg={bg}
              loading={isLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
