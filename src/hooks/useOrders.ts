'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, Order } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { useFilterStore } from '@/store/filterStore';

interface OrdersParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useOrders(params: OrdersParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { startDate, endDate } = useFilterStore();

  return useQuery({
    queryKey: ['orders', selectedAccountId, startDate, endDate, params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {
        startDate,
        endDate,
        page: params.page || 1,
        limit: params.limit || 20,
      };
      if (selectedAccountId) queryParams.accountId = selectedAccountId;
      if (params.status) queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;
      const { data } = await api.get<PaginatedResponse<Order>>('/api/orders', { params: queryParams });
      return data;
    },
  });
}
