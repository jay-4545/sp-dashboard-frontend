'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, Product } from '@/types';
import { useAccountStore } from '@/store/accountStore';

interface ProductsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(params: ProductsParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);

  return useQuery({
    queryKey: ['products', selectedAccountId, params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {
        page: params.page || 1,
        limit: params.limit || 20,
      };
      if (selectedAccountId) queryParams.accountId = selectedAccountId;
      if (params.search) queryParams.search = params.search;
      const { data } = await api.get<PaginatedResponse<Product>>('/api/products', {
        params: queryParams,
      });
      return data;
    },
  });
}
