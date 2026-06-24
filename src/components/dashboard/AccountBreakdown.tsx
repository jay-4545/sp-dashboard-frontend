'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Typography } from '@mui/material';
import { DataTable } from '@/components/shared/DataTable';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardSummary } from '@/types';

interface AccountBreakdownProps {
  data?: DashboardSummary;
  isLoading?: boolean;
}

type BreakdownRow = DashboardSummary['accountBreakdown'][number];

const columns: ColumnDef<BreakdownRow, unknown>[] = [
  {
    id: 'account',
    accessorFn: (row) => (row as Record<string, string>)['account.name'] || row.account_id,
    header: 'Account',
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {(row.original as Record<string, string>)['account.name'] ||
          row.original.account_id?.slice(0, 8)}
      </Typography>
    ),
  },
  {
    accessorKey: 'orderCount',
    header: 'Orders',
    cell: ({ getValue }) => formatNumber(getValue() as string | number),
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ getValue }) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
        {formatCurrency(getValue() as string | number)}
      </Typography>
    ),
  },
];

export function AccountBreakdown({ data, isLoading }: AccountBreakdownProps) {
  const rows = data?.accountBreakdown || [];

  return (
    <DataTable
      title="Per-Account Breakdown"
      subtitle="Revenue split across connected accounts"
      data={rows}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No account data available"
    />
  );
}
