'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { useSellerProfit } from '@/hooks/useSellerProfit';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { PurchasePriceDialog } from '@/components/seller-profit/PurchasePriceDialog';
import { ProfitSummaryCards } from '@/components/seller-profit/ProfitSummaryCards';
import { ProfitWaterfall } from '@/components/seller-profit/ProfitWaterfall';
import { ProfitAlerts } from '@/components/seller-profit/ProfitAlerts';
import { buildSellerProfitColumns } from '@/components/seller-profit/SellerProfitTable';
import { useUserStore } from '@/store/userStore';
import { SellerProfitProduct } from '@/types';

export default function SellerProfitPage() {
  const isAdmin = useUserStore((s) => s.isAdmin());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [priceProduct, setPriceProduct] = useState<SellerProfitProduct | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading } = useSellerProfit({ page, limit, search: debouncedSearch || undefined });

  const currency = data?.currency || 'INR';
  const summary = data?.summary;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <PageHeader
          title="Seller Profit"
          description="Track your actual profit per product — after Amazon fees and your purchase cost"
          formula={['Revenue', '− Amazon Fees', '− Purchase Price', '= Actual Profit']}
        />

        <ProfitAlerts summary={summary} isAdmin={isAdmin} isLoading={isLoading} />

        <ProfitSummaryCards summary={summary} currency={currency} isLoading={isLoading} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <DataTable
              title="Products"
              subtitle="Unique products with revenue, fees, and actual profit"
              data={data?.data || []}
              columns={buildSellerProfitColumns(setPriceProduct, isAdmin)}
              isLoading={isLoading}
              pagination={data?.pagination}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={(v) => {
                setLimit(v);
                setPage(1);
              }}
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              searchPlaceholder="Search product name, SKU, or ASIN..."
              emptyMessage="No products found. Sync listings or orders, then set purchase prices."
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
              <ProfitWaterfall summary={summary} currency={currency} isLoading={isLoading} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <PurchasePriceDialog product={priceProduct} onClose={() => setPriceProduct(null)} />
    </>
  );
}
