'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SellerAccount } from '@/types';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await api.get<SellerAccount[]>('/api/accounts');
      return data;
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string; name?: string; is_active?: boolean }) => {
      const { data } = await api.patch(`/api/accounts/${id}`, body);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
