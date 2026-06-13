'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useInventory } from '@/hooks/useInventory';
import { DataTable } from '@/components/shared/DataTable';
import { formatDate, formatNumber, cn } from '@/lib/utils';
import { InventorySnapshot } from '@/types';

const columns: ColumnDef<InventorySnapshot, unknown>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string || '—'}</span>
    ),
  },
  {
    accessorKey: 'asin',
    header: 'ASIN',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-slate-500">{getValue() as string || '—'}</span>
    ),
  },
  {
    accessorKey: 'account.name',
    header: 'Account',
    cell: ({ row }) => row.original.account?.name || '—',
  },
  {
    accessorKey: 'sellable_qty',
    header: 'Sellable',
    cell: ({ row }) => {
      const qty = row.original.sellable_qty;
      return (
        <span
          className={cn(
            'font-semibold',
            qty < 10 ? 'text-red-600' : qty < 50 ? 'text-yellow-600' : 'text-green-600'
          )}
        >
          {formatNumber(qty)}
        </span>
      );
    },
  },
  {
    accessorKey: 'reserved_qty',
    header: 'Reserved',
    cell: ({ getValue }) => formatNumber(getValue() as number),
  },
  {
    accessorKey: 'inbound_qty',
    header: 'Inbound',
    cell: ({ getValue }) => formatNumber(getValue() as number),
  },
  {
    accessorKey: 'unsellable_qty',
    header: 'Unsellable',
    cell: ({ getValue }) => formatNumber(getValue() as number),
  },
  {
    accessorKey: 'snapshotted_at',
    header: 'Snapshot',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
];

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [lowStock, setLowStock] = useState(false);
  const { data, isLoading } = useInventory({ page, lowStock });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => {
              setLowStock(e.target.checked);
              setPage(1);
            }}
            className="rounded border-slate-300"
          />
          Show low stock only (&lt; 10 units)
        </label>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No inventory snapshots. Data syncs hourly once Amazon credentials are configured."
      />

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
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
