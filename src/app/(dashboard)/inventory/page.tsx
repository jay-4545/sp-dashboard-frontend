'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useInventory } from '@/hooks/useInventory';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { DataTable } from '@/components/shared/DataTable';
import { formatDate, formatNumber } from '@/lib/utils';
import { InventorySnapshot } from '@/types';

const columns: ColumnDef<InventorySnapshot, unknown>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => (
      <Typography variant="caption"  sx={{ fontFamily: 'monospace' }}>
        {(getValue() as string) || '—'}
      </Typography>
    ),
  },
  {
    accessorKey: 'asin',
    header: 'ASIN',
    cell: ({ getValue }) => (
      <Typography variant="caption"  color="text.secondary" sx={{ fontFamily: 'monospace' }}>
        {(getValue() as string) || '—'}
      </Typography>
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
      const color = qty < 10 ? 'error.main' : qty < 50 ? 'warning.main' : 'success.main';
      return (
        <Typography variant="body2"  color={color} sx={{ fontWeight: 600 }}>
          {formatNumber(qty)}
        </Typography>
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
  const [limit, setLimit] = useState(20);
  const [lowStock, setLowStock] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading } = useInventory({ page, limit, lowStock, search: debouncedSearch || undefined });

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      pagination={data?.pagination}
      onPageChange={setPage}
      limit={limit}
      onLimitChange={(v) => { setLimit(v); setPage(1); }}
      search={search}
      onSearchChange={(v) => { setSearch(v); setPage(1); }}
      searchPlaceholder="Search SKU, ASIN, FNSKU..."
      toolbar={
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={lowStock}
              onChange={(e) => { setLowStock(e.target.checked); setPage(1); }}
            />
          }
          label={<Typography variant="caption">Low stock only (&lt; 10)</Typography>}
        />
      }
      emptyMessage={
        <>
          No inventory snapshots.{' '}
          <Typography component={Link} href="/accounts" variant="body2" color="primary" sx={{ display: 'inline' }}>
            Connect an account
          </Typography>{' '}
          and sync inventory.
        </>
      }
    />
  );
}
