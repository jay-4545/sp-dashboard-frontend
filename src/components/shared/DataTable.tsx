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
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { PaginatedResponse } from '@/types';
import { SectionCard } from '@/components/shared/SectionCard';

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
  title?: string;
  subtitle?: string;
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
  title,
  subtitle,
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

  const tableContent = (
    <>
      {showToolbar && (
        <Box sx={{ px: 2, py: 1.25, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ width: { xs: 150, sm: 200 }, '& input': { py: 0.75 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          {toolbar}
          {onLimitChange && limit !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Show
              </Typography>
              <FormControl size="small" sx={{ minWidth: 90 }}>
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
                </>
              )}
            </Typography>
          )}
        </Box>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : !data.length ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 200, py: 4, px: 2, textAlign: 'center', gap: 1 }}>
          <TableRowsIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} sx={{ bgcolor: 'grey.50' }}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
              {table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ bgcolor: i % 2 === 1 ? 'grey.50' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  return (
    <Stack spacing={1.5}>
      {title ? (
        <SectionCard title={title} subtitle={subtitle} noPadding>
          {tableContent}
        </SectionCard>
      ) : (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          {tableContent}
        </Paper>
      )}

      {pagination && pagination.totalPages > 0 && onPageChange && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 0.5 }}>
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
      sx={{ height: 20 }}
    />
  );
}
