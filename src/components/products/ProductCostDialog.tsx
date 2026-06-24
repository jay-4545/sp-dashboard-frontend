'use client';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useUpsertProductCost } from '@/hooks/useProducts';
import { Product } from '@/types';

interface ProductCostDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductCostDialog({ product, onClose }: ProductCostDialogProps) {
  const upsertCost = useUpsertProductCost();
  const [unitCost, setUnitCost] = useState('');
  const [shippingCost, setShippingCost] = useState('0');
  const [packagingCost, setPackagingCost] = useState('0');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (product) {
      setUnitCost(product.cost.unitCost != null ? String(product.cost.unitCost) : '');
      setShippingCost('0');
      setPackagingCost('0');
      setNote('');
    }
  }, [product]);

  if (!product) return null;

  const handleSave = () => {
    const parsedUnitCost = parseFloat(unitCost);
    if (isNaN(parsedUnitCost) || parsedUnitCost < 0) return;

    upsertCost.mutate(
      {
        accountId: product.account_id,
        sku: product.sku || '',
        asin: product.asin,
        unitCost: parsedUnitCost,
        shippingCost: parseFloat(shippingCost) || 0,
        packagingCost: parseFloat(packagingCost) || 0,
        currency: product.cost.currency || 'INR',
        note: note.trim() || undefined,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open maxWidth="xs" fullWidth onClose={onClose}>
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          fontWeight: 600,
        }}
      >
        Set Product Cost
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              SKU
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.sku || '—'}
            </Typography>
            {product.title && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {product.title}
              </Typography>
            )}
          </Box>
          <TextField
            label="Unit cost (INR)"
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            size="small"
            fullWidth
            required
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Shipping cost (INR)"
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Packaging cost (INR)"
            type="number"
            value={packagingCost}
            onChange={(e) => setPackagingCost(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!unitCost.trim() || upsertCost.isPending || !product.sku}
          onClick={handleSave}
        >
          {upsertCost.isPending ? <CircularProgress size={20} color="inherit" /> : 'Save Cost'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
