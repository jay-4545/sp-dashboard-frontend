'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Grid from '@mui/material/Grid';
import { Box, Typography, Chip, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { useProducts } from '@/hooks/useProducts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { DataTable } from '@/components/shared/DataTable';
import { ProductCostDialog } from '@/components/products/ProductCostDialog';
import { useUserStore } from '@/store/userStore';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

function ListingStatusChips({ statuses }: { statuses: string[] | null }) {
  if (!statuses || statuses.length === 0) {
    return <Typography variant="caption" color="text.secondary">—</Typography>;
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {statuses.map((s) => (
        <Chip
          key={s}
          label={s}
          size="small"
          variant="outlined"
          color={s === 'BUYABLE' ? 'success' : s === 'DISCOVERABLE' ? 'info' : 'default'}
          sx={{ height: 20 }}
        />
      ))}
    </Box>
  );
}

function buildColumns(onEditCost: (product: Product) => void, isAdmin: boolean): ColumnDef<Product, unknown>[] {
  const cols: ColumnDef<Product, unknown>[] = [
    {
      id: 'image',
      header: '',
      enableSorting: false,
      cell: ({ row }) =>
        row.original.main_image ? (
          <Avatar src={row.original.main_image} variant="rounded" sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar variant="rounded" sx={{ width: 30, height: 30, fontSize: '0.625rem' }}>
            —
          </Avatar>
        ),
    },
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
          {getValue() as string}
        </Typography>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => (
        <Typography
          variant="body2"
          sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {(getValue() as string) || '—'}
        </Typography>
      ),
    },
    {
      accessorKey: 'selling_price',
      header: 'Price',
      cell: ({ row }) =>
        formatCurrency(row.original.selling_price, row.original.currency || 'INR'),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ getValue }) => (getValue() as number | null) ?? '—',
    },
    {
      id: 'cost',
      header: 'Unit Cost',
      cell: ({ row }) => {
        const { cost } = row.original;
        return (
          <Typography
            variant="caption"
            sx={{ fontWeight: cost.hasCost ? 600 : 400, color: cost.hasCost ? 'text.primary' : 'text.secondary' }}
          >
            {cost.hasCost ? formatCurrency(cost.unitCost, cost.currency) : 'Not set'}
          </Typography>
        );
      },
    },
    {
      id: 'margin',
      header: 'Margin',
      cell: ({ row }) => {
        const { profit } = row.original;
        if (profit.marginPct == null) {
          return <Typography variant="caption" color="text.secondary">—</Typography>;
        }
        const color = profit.marginPct >= 0 ? 'success.main' : 'error.main';
        return (
          <Typography variant="caption" sx={{ fontWeight: 600, color }}>
            {profit.marginPct.toFixed(1)}%
          </Typography>
        );
      },
    },
    {
      id: 'listing_status',
      header: 'Status',
      cell: ({ row }) => <ListingStatusChips statuses={row.original.listing_status} />,
    },
    {
      accessorKey: 'account.name',
      header: 'Account',
      cell: ({ row }) => row.original.account?.name || '—',
    },
  ];

  if (isAdmin) {
    cols.push({
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <IconButton
          size="small"
          title="Set product cost"
          onClick={() => onEditCost(row.original)}
          disabled={!row.original.sku}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    });
  }

  return cols;
}

export default function ProductsPage() {
  const isAdmin = useUserStore((s) => s.isAdmin());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [costProduct, setCostProduct] = useState<Product | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading } = useProducts({ page, limit, search: debouncedSearch || undefined });

  const products = data?.data || [];
  const withCost = useMemo(() => products.filter((p) => p.cost.hasCost).length, [products]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <PageHeader
          title="Products"
          description="Manage listings, set unit costs (COGS), and track margins per SKU"
          formula={['Selling Price', '− Unit Cost', '= Gross Margin']}
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <MetricCard
              label="Listings"
              value={String(data?.pagination?.total ?? 0)}
              icon={Inventory2Icon}
              iconColor="#6366f1"
              iconBg="#eef2ff"
              loading={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <MetricCard
              label="Costs Set (this page)"
              value={`${withCost} / ${products.length}`}
              subtitle="Set costs for profit tracking"
              icon={PriceCheckIcon}
              iconColor="#16a34a"
              iconBg="#dcfce7"
              loading={isLoading}
            />
          </Grid>
        </Grid>

        <DataTable
          title="Product Catalog"
          subtitle={isAdmin ? 'Click edit to set unit cost per SKU' : 'View listing prices and margins'}
          data={products}
          columns={buildColumns(setCostProduct, isAdmin)}
          isLoading={isLoading}
          pagination={data?.pagination}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(v) => {
            setLimit(v);
            setPage(1);
          }}
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search SKU, ASIN, or title..."
          emptyMessage="No products found. Connect an account and run a listings sync."
        />
      </Box>
      <ProductCostDialog product={costProduct} onClose={() => setCostProduct(null)} />
    </>
  );
}
