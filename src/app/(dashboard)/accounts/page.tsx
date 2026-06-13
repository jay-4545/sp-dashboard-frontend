'use client';

import { CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useAccounts, useUpdateAccount } from '@/hooks/useAccounts';
import { useSyncStatus, useTriggerSync } from '@/hooks/useFinance';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const { data: syncData } = useSyncStatus();
  const updateAccount = useUpdateAccount();
  const triggerSync = useTriggerSync();

  const getLastSync = (accountId: string) => {
    const job = syncData?.recentJobs?.find((j) => j.account_id === accountId);
    return job;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Manage your 5 Amazon seller accounts. Add refresh tokens in the backend to enable sync.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts?.map((account) => {
            const lastSync = getLastSync(account.id);
            return (
              <div
                key={account.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{account.name}</h3>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{account.seller_id}</p>
                  </div>
                  <span
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      account.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {account.is_active ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {account.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Region</span>
                    <span className="font-medium text-slate-700">{account.region}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Marketplace</span>
                    <span className="font-mono text-xs text-slate-700">{account.marketplace_id}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Last Synced
                    </span>
                    <span className="text-xs text-slate-600">
                      {formatDateTime(account.last_synced_at)}
                    </span>
                  </div>
                  {lastSync && (
                    <div className="flex justify-between text-slate-500">
                      <span>Last Job</span>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          lastSync.status === 'success'
                            ? 'text-green-600'
                            : lastSync.status === 'failed'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        )}
                      >
                        {lastSync.sync_type} · {lastSync.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      updateAccount.mutate({ id: account.id, is_active: !account.is_active })
                    }
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {account.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() =>
                      triggerSync.mutate({ accountId: account.id, syncType: 'orders' })
                    }
                    disabled={triggerSync.isPending}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    <RefreshCw className={cn('h-3 w-3', triggerSync.isPending && 'animate-spin')} />
                    Sync
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
