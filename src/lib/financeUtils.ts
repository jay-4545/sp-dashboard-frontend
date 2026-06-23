export function formatEventType(eventType: string | null): string {
  if (!eventType) return '—';
  return eventType
    .replace(/EventList$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}

export function getFinancialEventDisplay(
  event: {
    amount?: number | string | null;
    currency?: string | null;
    fee_type?: string | null;
    event_type?: string | null;
  }
) {
  return {
    amount: event.amount,
    currency: event.currency || 'INR',
    feeType: event.fee_type || formatEventType(event.event_type),
    eventType: formatEventType(event.event_type),
  };
}
