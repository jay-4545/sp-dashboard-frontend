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
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Pagination,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PaginatedResponse } from '@/types';

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  pagination?: PaginatedResponse<T>['pagination'];
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
}

function getShowingRange(
  pagination: PaginatedResponse<unknown>['pagination'],
  currentCount: number
) {
  if (pagination.total === 0 || currentCount === 0) return { start: 0, end: 0 };
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(start + currentCount - 1, pagination.total);
  return { start, end };
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data found',
  pagination,
  onPageChange,
  limit,
  onLimitChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  toolbar,
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

  const showToolbar = onSearchChange || onLimitChange || toolbar;
  const showing = pagination ? getShowingRange(pagination, data.length) : null;

  return (
    <Stack spacing={1.5}>
      {showToolbar && (
        <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ width: { xs: 160, sm: 190 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          {toolbar}
          {onLimitChange && limit !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Show
              </Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={String(limit)}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <MenuItem key={n} value={String(n)}>
                      {n} / page
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {showing && pagination && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {pagination.total === 0 ? (
                'No results'
              ) : (
                <>
                  Showing {showing.start}–{showing.end} of {pagination.total}
                  {data.length > 0 && ` · ${data.length} on this page`}
                </>
              )}
            </Typography>
          )}
        </Paper>
      )}

      <TableContainer component={Paper} variant="outlined">
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !data.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.column.getCanSort() ? (
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {pagination && pagination.totalPages > 0 && onPageChange && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => onPageChange(page)}
            size="small"
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Stack>
  );
}

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  Shipped: 'success',
  Pending: 'warning',
  Canceled: 'error',
  Unshipped: 'info',
};

export function StatusBadge({ status }: { status: string | null }) {
  return (
    <Chip
      label={status || 'Unknown'}
      size="small"
      color={STATUS_COLORS[status || ''] || 'default'}
      variant="outlined"
      sx={{ height: 20, fontSize: '0.6875rem' }}
    />
  );
}
