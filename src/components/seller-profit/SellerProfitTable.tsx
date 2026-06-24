'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Box, Typography, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { SellerProfitProduct } from '@/types';

export function buildSellerProfitColumns(
  onSetPrice: (product: SellerProfitProduct) => void,
  isAdmin: boolean
): ColumnDef<SellerProfitProduct, unknown>[] {
  const cols: ColumnDef<SellerProfitProduct, unknown>[] = [
    {
      id: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const p = row.original;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 200 }}>
            {p.main_image ? (
              <Avatar src={p.main_image} variant="rounded" sx={{ width: 40, height: 40, border: 1, borderColor: 'divider' }} />
            ) : (
              <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'grey.100', color: 'grey.400' }}>
                <ImageNotSupportedIcon sx={{ fontSize: 18 }} />
              </Avatar>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}
                title={p.title || undefined}
              >
                {p.title || 'Unnamed product'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {p.sku}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'purchaseCost',
      header: 'Purchase Price',
      cell: ({ row }) => {
        const { purchaseCostPerUnit, hasCost, currency } = row.original;
        if (!hasCost || purchaseCostPerUnit == null) {
          return (
            <Chip
              label="+ Add price"
              size="small"
              color="warning"
              variant="outlined"
              onClick={isAdmin ? () => onSetPrice(row.original) : undefined}
              sx={{
                height: 22,
                fontWeight: 600,
                cursor: isAdmin ? 'pointer' : 'default',
                '&:hover': isAdmin ? { bgcolor: 'warning.50' } : {},
              }}
            />
          );
        }
        return (
          <Chip
            label={formatCurrency(purchaseCostPerUnit, currency)}
            size="small"
            sx={{ height: 24, fontWeight: 600, bgcolor: 'grey.50' }}
          />
        );
      },
    },
    {
      id: 'sellingPrice',
      header: 'Sell Price',
      cell: ({ row }) => {
        const price = row.original.avgSellingPrice ?? row.original.listingPrice;
        return (
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {formatCurrency(price, row.original.currency)}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'unitsSold',
      header: 'Sold',
      cell: ({ getValue }) => (
        <Chip label={formatNumber(getValue() as number)} size="small" variant="outlined" sx={{ height: 22, minWidth: 36 }} />
      ),
    },
    {
      accessorKey: 'totalRevenue',
      header: 'Revenue',
      cell: ({ row }) => (
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.dark' }}>
          {formatCurrency(row.original.totalRevenue, row.original.currency)}
        </Typography>
      ),
    },
    {
      accessorKey: 'totalAmazonFees',
      header: 'Amazon Fees',
      cell: ({ row }) => {
        const fees = row.original.totalAmazonFees;
        if (fees <= 0) return <Typography variant="caption" color="text.secondary">—</Typography>;
        return (
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.dark' }}>
            −{formatCurrency(fees, row.original.currency)}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'totalPurchaseCost',
      header: 'Your Cost',
      cell: ({ row }) => {
        const cost = row.original.totalPurchaseCost;
        if (cost <= 0) return <Typography variant="caption" color="text.secondary">—</Typography>;
        return (
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            −{formatCurrency(cost, row.original.currency)}
          </Typography>
        );
      },
    },
    {
      id: 'actualProfit',
      header: 'Actual Profit',
      cell: ({ row }) => {
        const { actualProfit, actualProfitPerUnit, marginPct, currency, hasCost, unitsSold } = row.original;

        if (unitsSold === 0) {
          return <Chip label="No sales" size="small" variant="outlined" sx={{ height: 22, color: 'text.secondary' }} />;
        }
        if (!hasCost) {
          return (
            <Chip
              label="Set price"
              size="small"
              color="warning"
              variant="outlined"
              onClick={isAdmin ? () => onSetPrice(row.original) : undefined}
              sx={{ height: 22, cursor: isAdmin ? 'pointer' : 'default' }}
            />
          );
        }
        if (actualProfit == null) return '—';

        const positive = actualProfit >= 0;
        return (
          <Box>
            <Chip
              label={formatCurrency(actualProfit, currency)}
              size="small"
              sx={{
                height: 26,
                fontWeight: 700,
                bgcolor: positive ? 'success.50' : 'error.50',
                color: positive ? 'success.dark' : 'error.dark',
                border: 1,
                borderColor: positive ? 'success.light' : 'error.light',
              }}
            />
            {(actualProfitPerUnit != null || marginPct != null) && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {actualProfitPerUnit != null && `${formatCurrency(actualProfitPerUnit, currency)}/unit`}
                {actualProfitPerUnit != null && marginPct != null && ' · '}
                {marginPct != null && `${marginPct.toFixed(1)}%`}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'account',
      header: 'Account',
      cell: ({ row }) => (
        <Typography variant="caption" color="text.secondary">
          {row.original.account?.name || '—'}
        </Typography>
      ),
    },
  ];

  if (isAdmin) {
    cols.push({
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <Tooltip title="Edit purchase price">
          <IconButton size="small" onClick={() => onSetPrice(row.original)} sx={{ color: 'text.secondary' }}>
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ),
    });
  }

  return cols;
}
