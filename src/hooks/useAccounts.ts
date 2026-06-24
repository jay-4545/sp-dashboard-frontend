'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SellerAccount } from '@/types';
import { toast } from '@/store/toastStore';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await api.get<SellerAccount[]>('/api/accounts');
      return data;
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; marketplace_id: string; region: 'IN' }) => {
      const { data } = await api.post<SellerAccount>('/api/accounts', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast('Account created', 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      is_active?: boolean;
    }) => {
      const { data } = await api.patch(`/api/accounts/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast('Account updated', 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/accounts/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast('Account deleted', 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}

export function useConnectAmazon() {
  return useMutation({
    mutationFn: async (accountId: string) => {
      const { data } = await api.get<{ authorizationUrl: string }>('/api/amazon/auth-url', {
        params: { accountId },
      });
      return data.authorizationUrl;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}

export function useDisconnectAmazon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: string) => {
      const { data } = await api.delete(`/api/amazon/disconnect/${accountId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast('Account disconnected', 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });
}
