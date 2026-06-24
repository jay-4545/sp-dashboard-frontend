'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { formatCurrency } from '@/lib/utils';
import { SectionCard } from '@/components/shared/SectionCard';
import { SellerProfitSummary } from '@/types';

interface ProfitWaterfallProps {
  summary?: SellerProfitSummary;
  currency?: string;
  isLoading?: boolean;
}

interface Segment {
  label: string;
  value: number;
  color: string;
  tooltip: string;
}

export function ProfitWaterfall({ summary, currency = 'INR', isLoading }: ProfitWaterfallProps) {
  if (isLoading || !summary) {
    return (
      <SectionCard title="Profit Breakdown">
        <Typography variant="caption" color="text.secondary">
          Loading breakdown...
        </Typography>
      </SectionCard>
    );
  }

  const revenue = summary.totalRevenue;
  const fees = summary.totalAmazonFees;
  const cost = summary.totalPurchaseCost;
  const profit = summary.totalActualProfit;

  if (revenue <= 0) return null;

  const segments: Segment[] = [
    { label: 'Revenue', value: revenue, color: '#22c55e', tooltip: 'Total sales revenue' },
    { label: 'Amazon Fees', value: fees, color: '#f59e0b', tooltip: 'Commission & Amazon charges' },
    { label: 'Purchase Cost', value: cost, color: '#94a3b8', tooltip: 'What you paid to source products' },
    { label: 'Actual Profit', value: Math.max(profit, 0), color: profit >= 0 ? '#16a34a' : '#ef4444', tooltip: 'What you keep' },
  ];

  const maxVal = revenue;

  return (
    <SectionCard title="Profit Breakdown" subtitle="How revenue becomes actual profit">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {segments.map((seg) => {
          const widthPct = maxVal > 0 ? Math.max((seg.value / maxVal) * 100, seg.value > 0 ? 4 : 0) : 0;
          return (
            <Box key={seg.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {seg.label}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatCurrency(seg.value, currency)}
                </Typography>
              </Box>
              <Tooltip title={seg.tooltip} placement="top">
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${widthPct}%`,
                      bgcolor: seg.color,
                      borderRadius: 1,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 1.5,
          pt: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {revenue > 0 ? `${((profit / revenue) * 100).toFixed(1)}% net margin on revenue` : '—'}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: profit >= 0 ? 'success.main' : 'error.main' }}
        >
          = {formatCurrency(profit, currency)}
        </Typography>
      </Box>
    </SectionCard>
  );
}
