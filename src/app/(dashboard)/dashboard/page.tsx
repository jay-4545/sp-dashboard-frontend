'use client';

import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDashboard } from '@/hooks/useDashboard';
import { useFinancePnl } from '@/hooks/useFinance';
import { PageHeader } from '@/components/shared/PageHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AccountBreakdown } from '@/components/dashboard/AccountBreakdown';
import { TopSKUs } from '@/components/dashboard/TopSKUs';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { data: pnl, isLoading: pnlLoading } = useFinancePnl();

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Dashboard"
        description="Overview of revenue, profit, and performance across your Amazon India accounts"
        formula={['Revenue', '− COGS', '− Fees', '− Refunds', '= Net Profit']}
      />
      <SummaryCards data={data} isLoading={isLoading} pnl={pnl} pnlLoading={pnlLoading} />
      <RevenueChart data={data} isLoading={isLoading} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AccountBreakdown data={data} isLoading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TopSKUs data={data} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Stack>
  );
}
