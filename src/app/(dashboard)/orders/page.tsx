'use client';

import { useState } from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { Box, IconButton, Chip, Typography, FormControl, Select, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ColumnDef } from '@tanstack/react-table';
import { useOrders } from '@/hooks/useOrders';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { DataTable, StatusBadge } from '@/components/shared/DataTable';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { getOrderItemCount, getPaymentLabel, getShippingLabel } from '@/lib/orderUtils';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReplayIcon from '@mui/icons-material/Replay';
import { Order } from '@/types';

const ORDER_STATUSES = ['Pending', 'Unshipped', 'Shipped', 'Canceled'];

const orderColumns = (onView: (order: Order) => void): ColumnDef<Order, unknown>[] => [
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    cell: ({ row }) => (
      <IconButton size="small" onClick={() => onView(row.original)} title="View order details">
        <VisibilityIcon sx={{ fontSize: 18 }} />
      </IconButton>
    ),
  },
  {
    accessorKey: 'amazon_order_id',
    header: 'Order ID',
    cell: ({ getValue }) => (
      <Typography variant="caption">
        {getValue() as string}
      </Typography>
    ),
  },
  {
    id: 'account',
    accessorFn: (row) => row.account?.name,
    header: 'Account',
    cell: ({ row }) => row.original.account?.name || '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue, row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StatusBadge status={getValue() as string | null} />
        {row.original.is_refunded && (
          <Chip label="Refunded" size="small" color="warning" sx={{ height: 20 }} />
        )}
      </Box>
    ),
  },
  {
    id: 'items',
    accessorFn: (row) => getOrderItemCount(row),
    header: 'Items',
    cell: ({ row }) => getOrderItemCount(row.original),
  },
  {
    accessorKey: 'order_total',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.original.order_total, row.original.currency || 'INR'),
  },
  {
    id: 'grossProfit',
    header: 'Profit',
    cell: ({ row }) => {
      const profit = row.original.computed?.grossProfit;
      if (profit == null) return '—';
      const color = profit >= 0 ? 'success.main' : 'error.main';
      return (
        <Typography variant="caption" sx={{ fontWeight: 600, color }}>
          {formatCurrency(profit, row.original.currency || 'INR')}
        </Typography>
      );
    },
  },
  {
    id: 'payment',
    accessorFn: (row) => getPaymentLabel(row.raw_data),
    header: 'Payment',
    cell: ({ row }) => getPaymentLabel(row.original.raw_data),
  },
  {
    id: 'shipTo',
    accessorFn: (row) => getShippingLabel(row.raw_data),
    header: 'Ship To',
    cell: ({ row }) => getShippingLabel(row.original.raw_data),
  },
  {
    accessorKey: 'fulfillment_channel',
    header: 'Channel',
    cell: ({ getValue }) => (
      <Chip label={(getValue() as string) || '—'} size="small" variant="outlined" sx={{ height: 20 }} />
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
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useOrders({
    page,
    limit,
    status: status || undefined,
    search: debouncedSearch || undefined,
  });

  const orders = data?.data ?? [];
  const refundedCount = orders.filter((o) => o.is_refunded).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Orders"
        description="Browse and inspect Amazon orders with profit and refund status"
      />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <MetricCard
            label="Total Orders"
            value={formatNumber(data?.pagination?.total ?? 0)}
            icon={ShoppingCartIcon}
            iconColor="#6366f1"
            iconBg="#eef2ff"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <MetricCard
            label="Refunded (this page)"
            value={String(refundedCount)}
            icon={ReplayIcon}
            iconColor="#d97706"
            iconBg="#fef3c7"
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <DataTable
        title="Order List"
        subtitle="Click the eye icon to view full order details"
        data={orders}
        columns={orderColumns(setSelectedOrder)}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(v) => { setLimit(v); setPage(1); }}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search order ID, SKU, ASIN..."
        toolbar={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={status}
                displayEmpty
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                <MenuItem value="">
                  <em>All statuses</em>
                </MenuItem>
                {ORDER_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        emptyMessage={
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">No orders found.</Typography>
            <Typography component={Link} href="/accounts" variant="body2" color="primary" sx={{ mt: 1, display: 'block' }}>
              Connect an account and sync orders
            </Typography>
          </Box>
        }
      />
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </Box>
  );
}
