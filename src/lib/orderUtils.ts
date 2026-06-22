import { Order, OrderItem, OrderRawData } from '@/types';

export function dedupeOrderItems(items: OrderItem[] | undefined): OrderItem[] {
  if (!items?.length) return [];

  const map = new Map<string, OrderItem>();
  for (const item of items) {
    const key = `${item.sku}::${item.asin}`;
    const existing = map.get(key);
    if (existing) {
      map.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      map.set(key, { ...item });
    }
  }
  return Array.from(map.values());
}

export function getOrderItemCount(order: Order): number {
  return dedupeOrderItems(order.items).reduce((sum, item) => sum + item.quantity, 0);
}

export function getShippingLabel(rawData: OrderRawData | null | undefined): string {
  const addr = rawData?.ShippingAddress;
  if (!addr) return '—';
  const parts = [addr.City, addr.StateOrRegion].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

export function getPaymentLabel(rawData: OrderRawData | null | undefined): string {
  if (!rawData) return '—';

  const details = rawData.PaymentMethodDetails;
  if (Array.isArray(details) && details.length) {
    const label = details[0];
    if (label === 'CashOnDelivery') return 'COD';
    if (label === 'Standard') return 'Prepaid';
    return label;
  }

  const method = rawData.PaymentMethod;
  if (method === 'COD') return 'COD';
  if (method === 'Other') return 'Prepaid';
  return method || '—';
}
