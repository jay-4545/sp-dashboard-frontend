'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, Product, ProductCost } from '@/types';
import { useAccountStore } from '@/store/accountStore';
import { toast } from '@/store/toastStore';

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

interface ProductCostsParams {
  accountId?: string;
  sku?: string;
}

export function useProductCosts(params: ProductCostsParams = {}) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const accountId = params.accountId || selectedAccountId;

  return useQuery({
    queryKey: ['product-costs', accountId, params.sku],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (accountId) queryParams.accountId = accountId;
      if (params.sku) queryParams.sku = params.sku;
      const { data } = await api.get<{ data: ProductCost[] }>('/api/products/costs', {
        params: queryParams,
      });
      return data.data;
    },
    enabled: !!accountId,
  });
}

interface UpsertCostInput {
  accountId: string;
  sku: string;
  unitCost: number;
  asin?: string;
  shippingCost?: number;
  packagingCost?: number;
  currency?: string;
  effectiveFrom?: string;
  note?: string;
}

export function useUpsertProductCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpsertCostInput) => {
      const { data } = await api.post<{ message: string; data: ProductCost }>(
        '/api/products/costs',
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-costs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-profit'] });
      toast('Purchase price saved', 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}

interface BulkCostInput {
  accountId: string;
  items: Array<{
    sku: string;
    unitCost: number;
    asin?: string;
    shippingCost?: number;
    packagingCost?: number;
    currency?: string;
    effectiveFrom?: string;
    note?: string;
  }>;
}

export function useBulkUpsertProductCosts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: BulkCostInput) => {
      const { data } = await api.post<{ message: string; saved: number }>(
        '/api/products/costs/bulk',
        body
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-costs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast(`Saved ${data.saved} product costs`, 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}
