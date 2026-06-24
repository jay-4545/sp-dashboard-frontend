'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SellerProfitResponse } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { useFilterStore } from '@/store/filterStore';

interface SellerProfitParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useSellerProfit(params: SellerProfitParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['seller-profit', selectedAccountId, startDate, endDate, params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {
        startDate,
        endDate,
        page: params.page || 1,
        limit: params.limit || 20,
      };
      if (selectedAccountId) queryParams.accountId = selectedAccountId;
      if (params.search) queryParams.search = params.search;
      const { data } = await api.get<SellerProfitResponse>('/api/seller-profit', {
        params: queryParams,
      });
      return data;
    },
  });
}
