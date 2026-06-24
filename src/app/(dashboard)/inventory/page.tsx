'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useInventory } from '@/hooks/useInventory';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { DataTable } from '@/components/shared/DataTable';
import { formatDate, formatNumber } from '@/lib/utils';
import { InventorySnapshot } from '@/types';

const columns: ColumnDef<InventorySnapshot, unknown>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => (
      <Typography variant="caption">
        {(getValue() as string) || '—'}
      </Typography>
    ),
  },
  {
    accessorKey: 'asin',
    header: 'ASIN',
    cell: ({ getValue }) => (
      <Typography variant="caption" color="text.secondary">
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
        <Typography variant="body2" color={color} sx={{ fontWeight: 600 }}>
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

  const rows = data?.data || [];
  const lowStockOnPage = useMemo(() => rows.filter((r) => r.sellable_qty < 10).length, [rows]);

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <PageHeader
          title="Inventory"
          description="FBA inventory snapshots — sellable, reserved, and inbound quantities"
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 4 }}>
        <MetricCard
          label="SKUs Tracked"
          value={formatNumber(data?.pagination?.total ?? 0)}
          icon={InventoryIcon}
          iconColor="#0ea5e9"
          iconBg="#e0f2fe"
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <MetricCard
          label="Low Stock (this page)"
          value={String(lowStockOnPage)}
          subtitle="Sellable &lt; 10 units"
          icon={WarningAmberIcon}
          iconColor="#d97706"
          iconBg="#fef3c7"
          loading={isLoading}
        />
      </Grid>

      <Grid size={12}>
        <DataTable
          title="Inventory Snapshots"
          subtitle="Latest FBA stock levels per SKU"
          data={rows}
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
      </Grid>
    </Grid>
  );
}
