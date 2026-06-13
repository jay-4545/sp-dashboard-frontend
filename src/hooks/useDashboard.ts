'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardSummary } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { useFilterStore } from '@/store/filterStore';

export function useDashboard() {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['dashboard', selectedAccountId, startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = { startDate, endDate };
      if (selectedAccountId) params.accountId = selectedAccountId;
      const { data } = await api.get<DashboardSummary>('/api/dashboard/summary', { params });
      return data;
    },
  });
}
