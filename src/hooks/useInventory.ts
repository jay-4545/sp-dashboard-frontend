'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, InventorySnapshot } from '@/types';
import { useAccountStore } from '@/store/accountStore';

interface InventoryParams {
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export function useInventory(params: InventoryParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);

  return useQuery({
    queryKey: ['inventory', selectedAccountId, params],
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {
        page: params.page || 1,
        limit: params.limit || 20,
      };
      if (selectedAccountId) queryParams.accountId = selectedAccountId;
      if (params.lowStock) queryParams.lowStock = true;
      const { data } = await api.get<PaginatedResponse<InventorySnapshot>>('/api/inventory', {
        params: queryParams,
      });
      return data;
    },
  });
}
