'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, FinancialEvent, FinancePnl, SyncJob } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { useFilterStore } from '@/store/filterStore';

export function useFinanceEvents(page = 1) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['finance-events', selectedAccountId, startDate, endDate, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { startDate, endDate, page, limit: 20 };
      if (selectedAccountId) params.accountId = selectedAccountId;
      const { data } = await api.get<PaginatedResponse<FinancialEvent>>('/api/finance/events', { params });
      return data;
    },
  });
}

export function useFinancePnl() {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['finance-pnl', selectedAccountId, startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = { startDate, endDate };
      if (selectedAccountId) params.accountId = selectedAccountId;
      const { data } = await api.get<FinancePnl>('/api/finance/pnl', { params });
      return data;
    },
  });
}

export function useSyncStatus() {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);

  return useQuery({
    queryKey: ['sync-status', selectedAccountId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (selectedAccountId) params.accountId = selectedAccountId;
      const { data } = await api.get<{ recentJobs: SyncJob[]; latestByType: unknown[] }>(
        '/api/sync/status',
        { params }
      );
      return data;
    },
    refetchInterval: 60000,
  });
}

export function useTriggerSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ accountId, syncType }: { accountId: string; syncType: string }) => {
      const { data } = await api.post('/api/sync/trigger', { accountId, syncType });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sync-status'] }),
  });
}
