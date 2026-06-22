'use client';

import { Paper, Typography, Box, CircularProgress } from '@mui/material';
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
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2"  gutterBottom sx={{ fontWeight: 600 }}>
        Revenue Trend
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
          <CircularProgress size={28} />
        </Box>
      ) : chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
          <Typography variant="body2" color="text.secondary">
            No revenue data for selected period
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v?.slice(5) || v} />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(value: number, name: string) => {
                if (name === 'Revenue') return [`₹${value.toLocaleString('en-IN')}`, name];
                return [value, name];
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
