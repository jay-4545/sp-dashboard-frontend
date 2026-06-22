export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface SellerAccount {
  id: string;
  name: string;
  seller_id: string;
  marketplace_id: string;
  region: 'NA' | 'EU' | 'FE' | 'IN';
  is_active: boolean;
  is_connected: boolean;
  token_expires_at: string | null;
  last_synced_at: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  account_id: string;
  asin: string;
  sku: string | null;
  title: string | null;
  listing_status: string | null;
  account?: { name: string };
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

export interface OrderItem {
  sku: string;
  asin: string;
  title: string;
  quantity: number;
  item_price: number | string | null;
}

export interface OrderRawData {
  IsPrime?: boolean;
  PaymentMethod?: string;
  SalesChannel?: string;
  EasyShipShipmentStatus?: string;
  PaymentMethodDetails?: string[];
  ShippingAddress?: {
    City?: string;
    StateOrRegion?: string;
    PostalCode?: string;
    CountryCode?: string;
  };
  EarliestShipDate?: string;
  LatestShipDate?: string;
  LatestDeliveryDate?: string;
  EarliestDeliveryDate?: string;
  ShipServiceLevel?: string;
  NumberOfItemsUnshipped?: number;
  [key: string]: unknown;
}

export interface Order {
  id: string;
  account_id: string;
  amazon_order_id: string;
  status: string | null;
  marketplace_id: string | null;
  order_total: number | string | null;
  currency: string | null;
  fulfillment_channel: 'FBA' | 'FBM' | null;
  purchase_date: string | null;
  raw_data?: OrderRawData | null;
  account?: { name: string };
  items?: OrderItem[];
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
