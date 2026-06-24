'use client';

import Link from 'next/link';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { SellerProfitSummary } from '@/types';

interface ProfitAlertsProps {
  summary?: SellerProfitSummary;
  isAdmin?: boolean;
  isLoading?: boolean;
}

export function ProfitAlerts({ summary, isAdmin, isLoading }: ProfitAlertsProps) {
  if (isLoading || !summary) return null;

  const missingPrices = summary.totalProducts - summary.productsWithCost;
  const needsFinance = !summary.hasFinanceData;
  const needsPrices = missingPrices > 0;

  if (!needsFinance && !needsPrices) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {needsFinance && (
        <Alert
          severity="info"
          icon={<SyncIcon fontSize="small" />}
          action={
            isAdmin ? (
              <Button component={Link} href="/accounts" size="small" color="inherit">
                Sync Finance
              </Button>
            ) : undefined
          }
        >
          <AlertTitle sx={{ mb: 0 }}>Finance data needed</AlertTitle>
          Run a finance sync to calculate Amazon fees per product. Without it, actual profit may be overstated.
        </Alert>
      )}
      {needsPrices && (
        <Alert
          severity="warning"
          icon={<PriceChangeIcon fontSize="small" />}
        >
          <AlertTitle sx={{ mb: 0 }}>
            {missingPrices} product{missingPrices > 1 ? 's' : ''} missing purchase price
          </AlertTitle>
          Click &quot;Add price&quot; on any row below to set your sourcing cost. It saves permanently — you only do it once per SKU.
        </Alert>
      )}
    </Box>
  );
}
