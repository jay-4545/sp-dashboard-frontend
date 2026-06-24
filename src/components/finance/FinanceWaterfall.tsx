'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { formatCurrency } from '@/lib/utils';
import { SectionCard } from '@/components/shared/SectionCard';
import { FinancePnl } from '@/types';

interface FinanceWaterfallProps {
  pnl?: FinancePnl;
  isLoading?: boolean;
}

export function FinanceWaterfall({ pnl, isLoading }: FinanceWaterfallProps) {
  if (isLoading || !pnl) {
    return (
      <SectionCard title="P&L Waterfall">
        <Typography variant="caption" color="text.secondary">
          Loading breakdown...
        </Typography>
      </SectionCard>
    );
  }

  const revenue = pnl.totalRevenue;
  if (revenue <= 0) return null;

  const segments = [
    { label: 'Revenue', value: revenue, color: '#22c55e', tooltip: 'Gross sales' },
    { label: 'COGS', value: pnl.totalCogs, color: '#94a3b8', tooltip: 'Cost of goods sold' },
    { label: 'Amazon Fees', value: pnl.totalFees, color: '#f59e0b', tooltip: 'Commission & charges' },
    { label: 'Refunds', value: pnl.totalRefunds, color: '#ef4444', tooltip: 'Customer refunds' },
    { label: 'Net Profit', value: Math.max(pnl.netProfit, 0), color: pnl.netProfit >= 0 ? '#16a34a' : '#ef4444', tooltip: 'Bottom line' },
  ];

  return (
    <SectionCard title="P&L Waterfall" subtitle="How revenue becomes net profit">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {segments.map((seg) => {
          const widthPct = Math.max((seg.value / revenue) * 100, seg.value > 0 ? 4 : 0);
          return (
            <Box key={seg.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {seg.label}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatCurrency(seg.value, pnl.currency)}
                </Typography>
              </Box>
              <Tooltip title={seg.tooltip} placement="top">
                <Box sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.100', overflow: 'hidden' }}>
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
      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {pnl.netMargin.toFixed(1)}% net margin
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: pnl.netProfit >= 0 ? 'success.main' : 'error.main' }}>
          = {formatCurrency(pnl.netProfit, pnl.currency)}
        </Typography>
      </Box>
    </SectionCard>
  );
}
