'use client';

import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface AccountBreakdownProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function AccountBreakdown({ data, isLoading }: AccountBreakdownProps) {
  const rows = data?.accountBreakdown || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Per-Account Breakdown</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-400">No account data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-4">Account</th>
                <th className="pb-2 pr-4">Orders</th>
                <th className="pb-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="py-2.5 pr-4 font-medium text-slate-700">
                    {(row as Record<string, string>)['account.name'] || row.account_id?.slice(0, 8)}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600">
                    {formatNumber(row.orderCount)}
                  </td>
                  <td className="py-2.5 font-medium text-slate-800">
                    {formatCurrency(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
