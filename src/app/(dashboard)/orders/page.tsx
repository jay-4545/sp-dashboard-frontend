'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useOrders } from '@/hooks/useOrders';
import { DataTable, StatusBadge } from '@/components/shared/DataTable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types';

const columns: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: 'amazon_order_id',
    header: 'Order ID',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'account.name',
    header: 'Account',
    cell: ({ row }) => row.original.account?.name || '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorKey: 'order_total',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.original.order_total, row.original.currency || 'USD'),
  },
  {
    accessorKey: 'fulfillment_channel',
    header: 'Channel',
    cell: ({ getValue }) => (
      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
        {(getValue() as string) || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'purchase_date',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page });

  return (
    <div className="space-y-4">
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No orders found. Sync will populate data once Amazon credentials are configured."
      />
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total}{' '}
            orders)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pagination.totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
