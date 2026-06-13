'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-semibold text-slate-600"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex cursor-pointer items-center gap-1 select-none">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : header.column.getIsSorted() === 'desc' ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    Shipped: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Canceled: 'bg-red-100 text-red-700',
    Unshipped: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
        colors[status || ''] || 'bg-slate-100 text-slate-600'
      )}
    >
      {status || 'Unknown'}
    </span>
  );
}
