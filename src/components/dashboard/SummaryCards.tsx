'use client';

import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface SummaryCardsProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Revenue',
      value: data ? formatCurrency(data.totalRevenue) : '—',
      icon: DollarSign,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Total Orders',
      value: data ? formatNumber(data.totalOrders) : '—',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Avg Order Value',
      value:
        data && data.totalOrders > 0
          ? formatCurrency(data.totalRevenue / data.totalOrders)
          : '—',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Top SKUs',
      value: data ? formatNumber(data.topSkus?.length || 0) : '—',
      icon: Package,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className={`rounded-lg p-2 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
