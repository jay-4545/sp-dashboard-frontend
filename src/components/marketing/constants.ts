import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SyncIcon from '@mui/icons-material/Sync';
import SecurityIcon from '@mui/icons-material/Security';
import { SvgIconComponent } from '@mui/icons-material';

export interface Feature {
  title: string;
  description: string;
  icon: SvgIconComponent;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number | null;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const FEATURES: Feature[] = [
  {
    title: 'Order & Profit Tracking',
    description: 'See gross profit per order with COGS breakdown, refund badges, and full order detail views.',
    icon: ShoppingCartIcon,
  },
  {
    title: 'Seller Profit Analytics',
    description: 'Track actual profit per product — revenue minus Amazon fees and your purchase price.',
    icon: TrendingUpIcon,
  },
  {
    title: 'Inventory Snapshots',
    description: 'Monitor FBA sellable, reserved, inbound, and unsellable quantities with low-stock alerts.',
    icon: InventoryIcon,
  },
  {
    title: 'Finance P&L',
    description: 'Full profit & loss from Amazon financial events — fees, refunds, COGS lost, and net margin.',
    icon: CurrencyRupeeIcon,
  },
  {
    title: 'Multi-Account Sync',
    description: 'Connect up to 5 Amazon India seller accounts and sync orders, inventory, finance, and listings.',
    icon: SyncIcon,
  },
  {
    title: 'Private & Secure',
    description: 'Your own SP-API private app. Data stays in your database — no third-party marketplace sharing.',
    icon: SecurityIcon,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'For solo sellers getting started with profit visibility.',
    features: [
      '1 Amazon India account',
      'Orders & inventory sync',
      'Basic dashboard KPIs',
      'Product cost (COGS) tracking',
      'Email support',
    ],
    cta: 'Get started free',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2499,
    period: 'month',
    description: 'For growing sellers who need full profit analytics.',
    features: [
      'Up to 3 seller accounts',
      'Seller profit per product',
      'Finance P&L & fee breakdown',
      'Returns & refund tracking',
      'Priority email support',
    ],
    highlighted: true,
    cta: 'Start free trial',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4999,
    period: 'month',
    description: 'For agencies and high-volume sellers managing multiple brands.',
    features: [
      'Up to 5 seller accounts',
      'Everything in Growth',
      'Scheduled sync jobs',
      'Export-ready reports',
      'Dedicated onboarding',
    ],
    cta: 'Contact sales',
  },
];

export const STATS = [
  { value: '5', label: 'Accounts per workspace' },
  { value: '6', label: 'Sync types supported' },
  { value: 'IN', label: 'Amazon India marketplace' },
  { value: '24/7', label: 'Sync on demand' },
];
