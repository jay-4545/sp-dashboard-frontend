import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num === null || isNaN(num as number)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num as number);
}

export function formatDate(date: string | null): string {
  if (!date) return '—';
  try {
    return format(parseISO(date), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

export function formatDateTime(date: string | null): string {
  if (!date) return '—';
  try {
    return format(parseISO(date), 'MMM d, yyyy h:mm a');
  } catch {
    return '—';
  }
}

export function formatNumber(num: number | string | null): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (n === null || isNaN(n as number)) return '0';
  return new Intl.NumberFormat('en-US').format(n as number);
}
