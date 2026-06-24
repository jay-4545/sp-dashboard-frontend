'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, FinancialEvent, FinancePnl, SyncJob, SyncType } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { useFilterStore } from '@/store/filterStore';

interface FinanceEventsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useFinanceEvents(params: FinanceEventsParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['finance-events', selectedAccountId, startDate, endDate, params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {
        startDate,
        endDate,
        page: params.page || 1,
        limit: params.limit || 20,
      };
      if (selectedAccountId) queryParams.accountId = selectedAccountId;
      if (params.search) queryParams.search = params.search;
      const { data } = await api.get<PaginatedResponse<FinancialEvent>>('/api/finance/events', {
        params: queryParams,
      });
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
    mutationFn: async ({ accountId, syncType }: { accountId: string; syncType: SyncType }) => {
      const { data } = await api.post('/api/sync/trigger', { accountId, syncType });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sync-status'] }),
  });
}
