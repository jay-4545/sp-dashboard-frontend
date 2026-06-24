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
  region: 'IN';
  is_active: boolean;
  is_connected: boolean;
  token_expires_at: string | null;
  last_synced_at: string | null;
  created_at?: string;
}

export interface ProductCost {
  id: string;
  account_id: string;
  sku: string;
  asin: string | null;
  unit_cost: number | string;
  shipping_cost: number | string;
  packaging_cost: number | string;
  currency: string;
  effective_from: string;
  effective_to: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  account_id: string;
  asin: string;
  sku: string | null;
  title: string | null;
  listing_status: string[] | null;
  product_type: string | null;
  condition_type: string | null;
  selling_price: number | string | null;
  mrp: number | string | null;
  quantity: number | null;
  currency: string | null;
  main_image: string | null;
  is_buyable: boolean | null;
  is_discoverable: boolean | null;
  cost: {
    unitCost: number | null;
    hasCost: boolean;
    currency: string;
  };
  profit: {
    perUnit: number | null;
    marginPct: number | null;
  };
  account?: { name: string };
}

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  totalCogsLost: number;
  totalRefunds: number;
  currency: string;
  accountBreakdown: Array<{
    account_id: string;
    orderCount: string | number;
    revenue: string | number;
    'account.name'?: string;
  }>;
  topSkus: Array<{
    sku: string;
    asin: string;
    totalQty: string | number;
    totalRevenue: string | number;
    totalCost: string | number;
    grossProfit: string | number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: string | number;
    orders: string | number;
  }>;
}

export interface OrderComputed {
  revenue: number;
  cost: number;
  refund: number;
  cogsLost: number;
  grossProfit: number;
}

export interface OrderItem {
  sku: string;
  asin: string;
  title: string;
  quantity: number;
  item_price: number | string | null;
  unit_cost?: number | string | null;
  total_cost?: number | string | null;
  is_returned?: boolean;
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
  is_refunded?: boolean;
  refund_amount?: number | string | null;
  cogs_lost?: number | string | null;
  computed?: OrderComputed;
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
  currency: string;
  orderCount: number;
  totalRevenue: number;
  totalCogs: number;
  cogsLostOnReturns: number;
  totalFees: number;
  totalPromotions: number;
  totalRefunds: number;
  totalTax: number;
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  eventCount: number;
  hasFinanceData: boolean;
  events: Array<{
    event_type: string;
    fee_type: string;
    kind?: string;
    total: number | string;
    currency: string;
  }>;
}

export type SyncType = 'orders' | 'inventory' | 'finance' | 'reports' | 'listings' | 'products';

export interface SyncJob {
  id: string;
  account_id: string;
  sync_type: SyncType | string;
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

export interface SellerProfitProduct {
  id: string;
  account_id: string;
  sku: string | null;
  asin: string;
  title: string | null;
  main_image: string | null;
  currency: string;
  listingPrice: number | null;
  purchaseCostPerUnit: number | null;
  hasCost: boolean;
  avgSellingPrice: number | null;
  unitsSold: number;
  totalRevenue: number;
  totalPurchaseCost: number;
  totalAmazonFees: number;
  actualProfit: number | null;
  actualProfitPerUnit: number | null;
  marginPct: number | null;
  account?: { name: string };
}

export interface SellerProfitSummary {
  totalProducts: number;
  unitsSold: number;
  totalRevenue: number;
  totalPurchaseCost: number;
  totalAmazonFees: number;
  totalActualProfit: number;
  netProfit: number;
  productsWithCost: number;
  hasFinanceData: boolean;
}

export interface SellerProfitResponse {
  currency: string;
  summary: SellerProfitSummary;
  data: SellerProfitProduct[];
  pagination: PaginatedResponse<SellerProfitProduct>['pagination'];
}
