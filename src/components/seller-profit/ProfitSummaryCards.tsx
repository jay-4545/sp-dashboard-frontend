'use client';

import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { SellerProfitSummary } from '@/types';

interface ProfitSummaryCardsProps {
  summary?: SellerProfitSummary;
  currency?: string;
  isLoading?: boolean;
}

const secondaryCards = [
  { key: 'products', label: 'Unique Products', icon: Inventory2Icon, color: '#6366f1', bg: '#eef2ff' },
  { key: 'units', label: 'Units Sold', icon: ShoppingBagIcon, color: '#0ea5e9', bg: '#e0f2fe' },
  { key: 'revenue', label: 'Revenue', icon: CurrencyRupeeIcon, color: '#16a34a', bg: '#dcfce7' },
  { key: 'fees', label: 'Amazon Fees', icon: StorefrontIcon, color: '#d97706', bg: '#fef3c7' },
  { key: 'cost', label: 'Purchase Cost', icon: LocalShippingIcon, color: '#64748b', bg: '#f1f5f9' },
] as const;

export function ProfitSummaryCards({ summary, currency = 'INR', isLoading }: ProfitSummaryCardsProps) {
  const actualProfit = summary?.totalActualProfit ?? 0;
  const netProfit = summary?.netProfit ?? 0;
  const actualPositive = actualProfit >= 0;
  const netPositive = netProfit >= 0;

  const values: Record<string, string> = {
    products: formatNumber(summary?.totalProducts ?? 0),
    units: formatNumber(summary?.unitsSold ?? 0),
    revenue: formatCurrency(summary?.totalRevenue ?? 0, currency),
    fees: formatCurrency(summary?.totalAmazonFees ?? 0, currency),
    cost: formatCurrency(summary?.totalPurchaseCost ?? 0, currency),
  };

  const subtitles: Record<string, string> = {
    products: `${summary?.productsWithCost ?? 0} with price set`,
    fees: summary?.hasFinanceData ? 'Allocated per order' : 'Sync finance data',
    cost: 'Your sourcing cost',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Featured profit cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              background: actualPositive
                ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)'
                : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)',
              borderColor: actualPositive ? 'success.light' : 'error.light',
            }}
          >
            <CardContent sx={{ py: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.5, fontWeight: 600 }}>
                    YOUR ACTUAL PROFIT
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    Revenue − Amazon fees − purchase price
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: actualPositive ? 'success.50' : 'error.50', color: actualPositive ? 'success.main' : 'error.main', width: 40, height: 40 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
              {isLoading ? (
                <Skeleton width={140} height={44} sx={{ mt: 1.5 }} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ mt: 1.5, fontWeight: 800, color: actualPositive ? 'success.dark' : 'error.dark' }}
                >
                  {formatCurrency(actualProfit, currency)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 60%)',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ py: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.5, fontWeight: 600 }}>
                    NET PROFIT (FINANCE)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    After all Amazon charges & refunds
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e2e8f0', color: 'primary.main', width: 40, height: 40 }}>
                  <AccountBalanceWalletIcon />
                </Avatar>
              </Box>
              {isLoading ? (
                <Skeleton width={140} height={44} sx={{ mt: 1.5 }} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ mt: 1.5, fontWeight: 800, color: netPositive ? 'primary.main' : 'error.dark' }}
                >
                  {formatCurrency(netProfit, currency)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary metrics */}
      <Grid container spacing={1.5}>
        {secondaryCards.map(({ key, label, icon: Icon, color, bg }) => (
          <Grid key={key} size={{ xs: 6, sm: 4, lg: 2 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ py: 1.5, px: 1.75, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Avatar sx={{ bgcolor: bg, color, width: 28, height: 28 }}>
                    <Icon sx={{ fontSize: 15 }} />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {label}
                  </Typography>
                </Box>
                {isLoading ? (
                  <Skeleton width={64} height={28} />
                ) : (
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {values[key]}
                  </Typography>
                )}
                {subtitles[key] && !isLoading && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {subtitles[key]}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
