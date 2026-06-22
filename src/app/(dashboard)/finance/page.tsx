'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';
import { useFinanceEvents, useFinancePnl } from '@/hooks/useFinance';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { DataTable } from '@/components/shared/DataTable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FinancialEvent } from '@/types';

const columns: ColumnDef<FinancialEvent, unknown>[] = [
  {
    accessorKey: 'posted_date',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: 'account.name',
    header: 'Account',
    cell: ({ row }) => row.original.account?.name || '—',
  },
  {
    accessorKey: 'event_type',
    header: 'Event Type',
    cell: ({ getValue }) => (
      <Chip label={(getValue() as string) || '—'} size="small" color="secondary" variant="outlined" />
    ),
  },
  {
    accessorKey: 'fee_type',
    header: 'Fee Type',
    cell: ({ getValue }) => (getValue() as string) || '—',
  },
  {
    accessorKey: 'amazon_order_id',
    header: 'Order ID',
    cell: ({ getValue }) => (
      <Typography variant="caption"  sx={{ fontFamily: 'monospace' }}>
        {(getValue() as string) || '—'}
      </Typography>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency || 'INR'),
  },
];

export default function FinancePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data: events, isLoading } = useFinanceEvents({ page, limit, search: debouncedSearch || undefined });
  const { data: pnl, isLoading: pnlLoading } = useFinancePnl();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        {[
          { label: 'Total Revenue', value: formatCurrency(pnl?.totalRevenue || 0), color: 'success.main', loading: pnlLoading },
          { label: 'Event Types', value: pnl?.events?.length || 0, color: 'text.primary', loading: pnlLoading },
          { label: 'Total Events', value: events?.pagination?.total || 0, color: 'text.primary', loading: isLoading },
        ].map(({ label, value, color, loading }) => (
          <Grid size={{ xs: 12, sm: 4 }} key={label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                {loading ? (
                  <Skeleton width={80} height={36} sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="h5"  color={color} sx={{ mt: 0.5, fontWeight: 700 }}>
                    {value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pnl?.events && pnl.events.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2"  gutterBottom sx={{ fontWeight: 600 }}>
              P&L Breakdown
            </Typography>
            <Grid container spacing={1}>
              {pnl.events.map((e, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {e.fee_type || e.event_type}
                    </Typography>
                    <Typography variant="body2"  sx={{ fontWeight: 600 }}>
                      {formatCurrency(e.total, e.currency)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      <DataTable
        data={events?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={events?.pagination}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(v) => { setLimit(v); setPage(1); }}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search order ID, event type, fee type..."
        emptyMessage={
          <>
            No financial events.{' '}
            <Typography component={Link} href="/accounts" variant="body2" color="primary" sx={{ display: 'inline' }}>
              Connect an account
            </Typography>{' '}
            and sync finance data.
          </>
        }
      />
    </Box>
  );
}
