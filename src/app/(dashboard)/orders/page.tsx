'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Box, IconButton, Chip, Typography, FormControl, Select, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useOrders } from '@/hooks/useOrders';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { DataTable, StatusBadge } from '@/components/shared/DataTable';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getOrderItemCount, getPaymentLabel, getShippingLabel } from '@/lib/orderUtils';
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
      <Typography variant="caption"  sx={{ fontFamily: 'monospace' }}>
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
    cell: ({ getValue }) => <StatusBadge status={getValue() as string | null} />,
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
      <Chip label={(getValue() as string) || '—'} size="small" variant="outlined" sx={{ fontFamily: 'monospace', height: 20, fontSize: '0.6875rem' }} />
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

  return (
    <Box>
      <DataTable
        data={data?.data ?? []}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
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
