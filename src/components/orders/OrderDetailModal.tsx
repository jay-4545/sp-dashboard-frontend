'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/DataTable';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { dedupeOrderItems, getPaymentLabel } from '@/lib/orderUtils';
import { Order } from '@/types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const raw = order.raw_data;
  const items = dedupeOrderItems(order.items);
  const shipping = raw?.ShippingAddress;
  const itemTotal = items.reduce((sum, i) => sum + (Number(i.item_price) || 0), 0);
  const currency = order.currency || 'INR';
  const computed = order.computed;

  const copyOrderId = async () => {
    await navigator.clipboard.writeText(order.amazon_order_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const headerStats = [
    { label: 'Order Total', value: formatCurrency(order.order_total, currency) },
    { label: 'Payment', value: getPaymentLabel(raw) },
    { label: 'Items', value: `${items.reduce((s, i) => s + i.quantity, 0)} units` },
  ];

  if (computed) {
    headerStats.push({
      label: 'Gross Profit',
      value: formatCurrency(computed.grossProfit, currency),
    });
  }

  return (
    <Dialog open maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
              ORDER DETAILS
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {order.amazon_order_id}
              </Typography>
              <IconButton size="small" onClick={copyOrderId} sx={{ color: 'inherit' }}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
              <StatusBadge status={order.status} />
              {order.is_refunded && <Chip label="Refunded" size="small" color="warning" />}
              {raw?.IsPrime && <Chip label="Prime" size="small" color="warning" />}
              <Chip label={order.fulfillment_channel || '—'} size="small" variant="outlined" sx={{ color: 'inherit', borderColor: 'rgba(255,255,255,0.3)' }} />
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={1} sx={{ mt: 2 }}>
          {headerStats.map(({ label, value }) => (
            <Grid size={{ xs: 6, sm: 3 }} key={label}>
              <Paper sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        {computed && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Profit Breakdown
            </Typography>
            <Grid container spacing={1}>
              {[
                { label: 'Revenue', value: computed.revenue },
                { label: 'COGS', value: computed.cost },
                { label: 'Refund', value: computed.refund },
                { label: 'COGS Lost', value: computed.cogsLost },
                { label: 'Gross Profit', value: computed.grossProfit, highlight: true },
              ].map(({ label, value, highlight }) => (
                <Grid size={{ xs: 6, sm: 4 }} key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: highlight ? 700 : 500,
                      color: highlight ? (value >= 0 ? 'success.main' : 'error.main') : 'text.primary',
                    }}
                  >
                    {formatCurrency(value, currency)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoItem label="Account" value={order.account?.name || '—'} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoItem label="Purchase Date" value={formatDateTime(order.purchase_date)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoItem label="Sales Channel" value={raw?.SalesChannel || '—'} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoItem label="EasyShip" value={raw?.EasyShipShipmentStatus || '—'} />
          </Grid>
        </Grid>

        {shipping && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'info.50', borderColor: 'info.100' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <LocationOnIcon color="info" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Shipping Address
              </Typography>
            </Box>
            <Typography variant="body2">
              {[shipping.City, shipping.StateOrRegion].filter(Boolean).join(', ')}
              {shipping.PostalCode && ` · PIN ${shipping.PostalCode}`}
            </Typography>
            {raw?.ShipServiceLevel && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Service: {raw.ShipServiceLevel}
              </Typography>
            )}
          </Paper>
        )}

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {[
            { label: 'Earliest Ship', value: formatDateTime(raw?.EarliestShipDate ?? null) },
            { label: 'Latest Ship', value: formatDateTime(raw?.LatestShipDate ?? null) },
            { label: 'Earliest Delivery', value: formatDateTime(raw?.EarliestDeliveryDate ?? null) },
            { label: 'Latest Delivery', value: formatDateTime(raw?.LatestDeliveryDate ?? null) },
          ].map(({ label, value }) => (
            <Grid size={{ xs: 6, sm: 3 }} key={label}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Line Items ({items.length})
          </Typography>
          {itemTotal > 0 && (
            <Typography variant="caption" color="text.secondary">
              Items total:{' '}
              <Typography component="span" variant="caption" sx={{ fontWeight: 700 }}>
                {formatCurrency(itemTotal, currency)}
              </Typography>
            </Typography>
          )}
        </Box>

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No line items
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {['SKU', 'ASIN', 'Title', 'Qty', 'Price', 'Cost', 'Returned'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.sku}-${item.asin}`}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{item.asin}</TableCell>
                  <TableCell sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                    {item.title}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.item_price, currency)}</TableCell>
                  <TableCell>
                    {item.total_cost != null ? formatCurrency(item.total_cost, currency) : '—'}
                  </TableCell>
                  <TableCell>
                    {item.is_returned ? (
                      <Chip label="Yes" size="small" color="warning" sx={{ height: 20 }} />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
