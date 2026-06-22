'use client';

import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDashboard } from '@/hooks/useDashboard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AccountBreakdown } from '@/components/dashboard/AccountBreakdown';
import { TopSKUs } from '@/components/dashboard/TopSKUs';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <Stack spacing={3}>
      <SummaryCards data={data} isLoading={isLoading} />
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
