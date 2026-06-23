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
import { getFinancialEventDisplay, formatEventType } from '@/lib/financeUtils';
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
    cell: ({ row }) => (
      <Chip
        label={formatEventType(row.original.event_type)}
        size="small"
        color="secondary"
        variant="outlined"
        sx={{ '& .MuiChip-label': { fontSize: '0.6875rem' } }}
      />
    ),
  },
  {
    accessorKey: 'fee_type',
    header: 'Fee Type',
    cell: ({ row }) => {
      const { feeType } = getFinancialEventDisplay(row.original);
      return (
        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
          {feeType}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'amazon_order_id',
    header: 'Order ID',
    cell: ({ getValue }) => (
      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
        {(getValue() as string) || '—'}
      </Typography>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const { amount, currency } = getFinancialEventDisplay(row.original);
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      return (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: num != null && num < 0 ? 'error.main' : num != null && num > 0 ? 'success.main' : 'text.primary',
          }}
        >
          {formatCurrency(amount, currency)}
        </Typography>
      );
    },
  },
];

export default function FinancePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data: events, isLoading } = useFinanceEvents({ page, limit, search: debouncedSearch || undefined });
  const { data: pnl, isLoading: pnlLoading } = useFinancePnl();

  const currency = pnl?.currency || 'INR';
  const netProfitColor = (pnl?.netProfit ?? 0) >= 0 ? 'success.main' : 'error.main';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        {[
          {
            label: 'Gross Revenue',
            value: formatCurrency(pnl?.totalRevenue || 0, currency),
            color: 'success.main',
            loading: pnlLoading,
          },
          {
            label: 'Amazon Fees',
            value: formatCurrency(pnl?.totalFees || 0, currency),
            color: 'warning.main',
            loading: pnlLoading,
          },
          {
            label: 'Net Profit',
            value: formatCurrency(pnl?.netProfit || 0, currency),
            color: netProfitColor,
            loading: pnlLoading,
            subtitle: pnl && !pnl.hasFinanceData ? 'Sync finance for fee breakdown' : 'Before product costs (COGS)',
          },
          {
            label: 'Finance Events',
            value: pnl?.eventCount ?? events?.pagination?.total ?? 0,
            color: 'text.primary',
            loading: pnlLoading || isLoading,
            subtitle: 'Unique fee/charge lines (deduped)',
          },
        ].map(({ label, value, color, loading, subtitle }) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                {loading ? (
                  <Skeleton width={80} height={36} sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="h5" color={color} sx={{ mt: 0.5, fontWeight: 700 }}>
                    {value}
                  </Typography>
                )}
                {subtitle && !loading && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {subtitle}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                P&L Breakdown
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: netProfitColor }}>
                Net: {formatCurrency(pnl.netProfit, currency)}
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {pnl.events.map((e, i) => {
                const amount = parseFloat(e.total || '0');
                const label = e.fee_type || formatEventType(e.event_type);
                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: '0.75rem', color: amount < 0 ? 'error.main' : 'success.main' }}
                      >
                        {formatCurrency(e.total, e.currency)}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
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
