'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { useUpsertProductCost } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';
import { SellerProfitProduct } from '@/types';

interface PurchasePriceDialogProps {
  product: SellerProfitProduct | null;
  onClose: () => void;
}

export function PurchasePriceDialog({ product, onClose }: PurchasePriceDialogProps) {
  const upsertCost = useUpsertProductCost();
  const [purchasePrice, setPurchasePrice] = useState('');

  useEffect(() => {
    if (product) {
      setPurchasePrice(
        product.purchaseCostPerUnit != null ? String(product.purchaseCostPerUnit) : ''
      );
    }
  }, [product]);

  const preview = useMemo(() => {
    if (!product) return null;
    const cost = parseFloat(purchasePrice);
    if (isNaN(cost) || cost < 0) return null;
    const sell = product.avgSellingPrice ?? product.listingPrice;
    if (sell == null) return null;
    const perUnit = sell - cost;
    return { sell, cost, perUnit, margin: sell > 0 ? (perUnit / sell) * 100 : 0 };
  }, [product, purchasePrice]);

  if (!product) return null;

  const handleSave = () => {
    const price = parseFloat(purchasePrice);
    if (isNaN(price) || price < 0 || !product.sku) return;

    upsertCost.mutate(
      {
        accountId: product.account_id,
        sku: product.sku,
        asin: product.asin,
        unitCost: price,
        currency: product.currency || 'INR',
        note: 'Set from Seller Profit page',
      },
      { onSuccess: onClose }
    );
  };

  const currency = product.currency || 'INR';

  return (
    <Dialog open maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Set Purchase Price
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Saved permanently — used for all future profit calculations
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {product.main_image ? (
              <Avatar src={product.main_image} variant="rounded" sx={{ width: 56, height: 56 }} />
            ) : (
              <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}>
                <ImageNotSupportedIcon color="disabled" />
              </Avatar>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {product.title || 'Unnamed product'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SKU: {product.sku}
              </Typography>
              {product.asin && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  ASIN: {product.asin}
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            label="Purchase price (INR)"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            fullWidth
            autoFocus
            placeholder="e.g. 150"
            helperText="Je price par tame aa product lai cho"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />

          {preview && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                Profit preview (per unit)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">Selling price</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatCurrency(preview.sell, currency)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">Purchase price</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                  −{formatCurrency(preview.cost, currency)}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.75 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Gross / unit
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: preview.perUnit >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatCurrency(preview.perUnit, currency)} ({preview.margin.toFixed(1)}%)
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.625rem' }}>
                Amazon fees are deducted separately in actual profit
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!purchasePrice.trim() || upsertCost.isPending}
          onClick={handleSave}
        >
          {upsertCost.isPending ? <CircularProgress size={20} color="inherit" /> : 'Save Price'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
