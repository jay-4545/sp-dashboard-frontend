'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardSummary } from '@/types';

interface RevenueChartProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const chartData =
    data?.revenueByDay?.map((d) => ({
      date: d.date,
      revenue: parseFloat(d.revenue || '0'),
      orders: parseInt(d.orders || '0', 10),
    })) || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Revenue Trend</h3>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          No revenue data for selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => v?.slice(5) || v}
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
