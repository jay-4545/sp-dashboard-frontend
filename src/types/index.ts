export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SellerAccount {
  id: string;
  name: string;
  seller_id: string;
  marketplace_id: string;
  region: 'NA' | 'EU' | 'FE';
  is_active: boolean;
  last_synced_at: string | null;
  created_at?: string;
}

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  accountBreakdown: Array<{
    account_id: string;
    orderCount: string;
    revenue: string;
    'account.name'?: string;
  }>;
  topSkus: Array<{
    sku: string;
    asin: string;
    totalQty: string;
    totalRevenue: string;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: string;
    orders: string;
  }>;
}

export interface Order {
  id: string;
  account_id: string;
  amazon_order_id: string;
  status: string | null;
  marketplace_id: string | null;
  order_total: number | null;
  currency: string | null;
  fulfillment_channel: 'FBA' | 'FBM' | null;
  purchase_date: string | null;
  account?: { name: string };
  items?: Array<{
    sku: string;
    asin: string;
    title: string;
    quantity: number;
    item_price: number;
  }>;
}

export interface InventorySnapshot {
  id: string;
  account_id: string;
  asin: string | null;
  sku: string | null;
  fnsku: string | null;
  sellable_qty: number;
  unsellable_qty: number;
  reserved_qty: number;
  inbound_qty: number;
  snapshotted_at: string;
  account?: { name: string };
}

export interface FinancialEvent {
  id: string;
  account_id: string;
  amazon_order_id: string | null;
  event_type: string | null;
  amount: number | null;
  currency: string | null;
  fee_type: string | null;
  posted_date: string | null;
  account?: { name: string };
}

export interface FinancePnl {
  totalRevenue: number;
  events: Array<{
    event_type: string;
    fee_type: string;
    total: string;
    currency: string;
  }>;
}

export interface SyncJob {
  id: string;
  account_id: string;
  sync_type: string;
  status: 'running' | 'success' | 'failed';
  records_synced: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
  account?: { name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
