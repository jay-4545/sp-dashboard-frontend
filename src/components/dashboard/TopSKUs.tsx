'use client';

import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface TopSKUsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function TopSKUs({ data, isLoading }: TopSKUsProps) {
  const skus = data?.topSkus || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Top SKUs</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ) : skus.length === 0 ? (
        <p className="text-sm text-slate-400">No SKU data available</p>
      ) : (
        <div className="space-y-2">
          {skus.map((sku, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="font-mono text-sm font-medium text-slate-700">{sku.sku || '—'}</p>
                <p className="text-xs text-slate-400">{sku.asin}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  {formatCurrency(sku.totalRevenue)}
                </p>
                <p className="text-xs text-slate-500">{formatNumber(sku.totalQty)} units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
