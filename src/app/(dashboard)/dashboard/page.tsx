'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AccountBreakdown } from '@/components/dashboard/AccountBreakdown';
import { TopSKUs } from '@/components/dashboard/TopSKUs';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <SummaryCards data={data} isLoading={isLoading} />
      <RevenueChart data={data} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AccountBreakdown data={data} isLoading={isLoading} />
        <TopSKUs data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
