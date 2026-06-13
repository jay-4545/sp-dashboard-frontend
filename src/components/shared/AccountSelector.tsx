'use client';

import { useAccounts } from '@/hooks/useAccounts';
import { useAccountStore } from '@/store/accountStore';

export function AccountSelector() {
  const { data: accounts, isLoading } = useAccounts();
  const { selectedAccountId, setSelectedAccountId } = useAccountStore();

  if (isLoading) {
    return (
      <select disabled className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-400">
        <option>Loading...</option>
      </select>
    );
  }

  return (
    <select
      value={selectedAccountId || ''}
      onChange={(e) => setSelectedAccountId(e.target.value || null)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">All Accounts</option>
      {accounts?.map((account) => (
        <option key={account.id} value={account.id}>
          {account.name}
        </option>
      ))}
    </select>
  );
}
