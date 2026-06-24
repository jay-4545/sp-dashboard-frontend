'use client';

import { Box, CircularProgress } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SectionCard } from '@/components/shared/SectionCard';
import { DashboardSummary } from '@/types';

interface RevenueChartProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const chartData =
    data?.revenueByDay?.map((d) => ({
      date: d.date,
      revenue: typeof d.revenue === 'number' ? d.revenue : parseFloat(d.revenue || '0'),
      orders: typeof d.orders === 'number' ? d.orders : parseInt(d.orders || '0', 10),
    })) || [];

  return (
    <SectionCard title="Revenue Trend" subtitle="Daily sales for the selected period">
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <CircularProgress size={28} />
        </Box>
      ) : chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Box component="span" sx={{ color: 'text.secondary' }}>
            No revenue data for selected period
          </Box>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v?.slice(5) || v} />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
              formatter={(value, name) => {
                const num = typeof value === 'number' ? value : Number(value ?? 0);
                if (name === 'Revenue') return [`₹${num.toLocaleString('en-IN')}`, name];
                return [num, name];
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </SectionCard>
  );
}
