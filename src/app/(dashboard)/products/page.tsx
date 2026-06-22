'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Typography, Chip } from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { DataTable } from '@/components/shared/DataTable';
import { Product } from '@/types';

const columns: ColumnDef<Product, unknown>[] = [
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
        {getValue() as string}
      </Typography>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ getValue }) => (
      <Typography variant="body2" sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {(getValue() as string) || '—'}
      </Typography>
    ),
  },
  {
    accessorKey: 'listing_status',
    header: 'Status',
    cell: ({ getValue }) => <Chip label={(getValue() as string) || '—'} size="small" variant="outlined" />,
  },
  {
    accessorKey: 'account.name',
    header: 'Account',
    cell: ({ row }) => row.original.account?.name || '—',
  },
];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading } = useProducts({ page, limit, search: debouncedSearch || undefined });

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
      searchPlaceholder="Search SKU, ASIN, or title..."
      emptyMessage="No products found. Connect an account and run a listings sync."
    />
  );
}
