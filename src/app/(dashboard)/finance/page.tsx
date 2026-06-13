'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useFinanceEvents, useFinancePnl } from '@/hooks/useFinance';
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
      <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
        {(getValue() as string) || '—'}
      </span>
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
      <span className="font-mono text-xs">{getValue() as string || '—'}</span>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency || 'USD'),
  },
];

export default function FinancePage() {
  const [page, setPage] = useState(1);
  const { data: events, isLoading } = useFinanceEvents(page);
  const { data: pnl, isLoading: pnlLoading } = useFinancePnl();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          {pnlLoading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatCurrency(pnl?.totalRevenue || 0)}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Event Types</p>
          {pnlLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {pnl?.events?.length || 0}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Events</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {events?.pagination?.total || 0}
            </p>
          )}
        </div>
      </div>

      {pnl?.events && pnl.events.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">P&L Breakdown</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pnl.events.map((e, i) => (
              <div key={i} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-600">{e.fee_type || e.event_type}</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(e.total, e.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        data={events?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No financial events. Data syncs every 6 hours once Amazon credentials are configured."
      />

      {events && events.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {events.pagination.page} of {events.pagination.totalPages}
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
              disabled={page >= events.pagination.totalPages}
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
