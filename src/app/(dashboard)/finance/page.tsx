'use client';

import { useState } from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { ColumnDef } from '@tanstack/react-table';
import { Box, Typography, Chip } from '@mui/material';
import { useFinanceEvents, useFinancePnl } from '@/hooks/useFinance';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FinanceSummaryCards } from '@/components/finance/FinanceSummaryCards';
import { FinanceWaterfall } from '@/components/finance/FinanceWaterfall';
import { SectionCard } from '@/components/shared/SectionCard';
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
      />
    ),
  },
  {
    accessorKey: 'fee_type',
    header: 'Fee Type',
    cell: ({ row }) => {
      const { feeType } = getFinancialEventDisplay(row.original);
      return (
        <Typography variant="caption">
          {feeType}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'amazon_order_id',
    header: 'Order ID',
    cell: ({ getValue }) => (
      <Typography variant="caption">
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
            color: num != null && num < 0 ? 'error.main' : num != null && num > 0 ? 'success.main' : 'text.primary',
          }}
        >
          {formatCurrency(amount ?? null, currency)}
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Finance"
        description="Full profit & loss from Amazon financial events — fees, refunds, COGS, and margins"
        formula={['Revenue', '− COGS', '− Fees', '− Refunds', '− COGS Lost', '= Net Profit']}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <FinanceSummaryCards pnl={pnl} isLoading={pnlLoading} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
            <FinanceWaterfall pnl={pnl} isLoading={pnlLoading} />
          </Box>
        </Grid>
      </Grid>

      {pnl?.events && pnl.events.length > 0 && (
        <SectionCard
          title="P&L Breakdown"
          subtitle="Aggregated fee and charge lines"
          action={
            <Typography variant="body2" sx={{ fontWeight: 600, color: netProfitColor }}>
              Net: {formatCurrency(pnl.netProfit, currency)}
            </Typography>
          }
        >
          <Grid container spacing={1}>
            {pnl.events.map((e, i) => {
              const amount = typeof e.total === 'string' ? parseFloat(e.total) : e.total;
              const label = e.fee_type || formatEventType(e.event_type);
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      px: 1.5,
                      py: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: amount < 0 ? 'error.main' : 'success.main' }}
                    >
                      {formatCurrency(e.total, e.currency)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </SectionCard>
      )}

      <DataTable
        title="Financial Events"
        subtitle="Individual fee and charge lines from Amazon"
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
