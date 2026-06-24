'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button, Chip, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const highlights = [
  'Actual profit per product',
  'Amazon India SP-API',
  'Up to 5 seller accounts',
];

function DashboardPreview() {
  const bars = [65, 45, 80, 55, 90, 70, 85];
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2.5,
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ px: 2, py: 1.25, bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.625rem' }}>
          dashboard.seller.app
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { label: 'Revenue', value: '₹4.8L', color: '#16a34a' },
            { label: 'Net Profit', value: '₹2.0L', color: '#3b82f6' },
            { label: 'Orders', value: '1,284', color: '#6366f1' },
          ].map((kpi) => (
            <Grid key={kpi.label} size={4}>
              <Box sx={{ bgcolor: '#f8fafc', borderRadius: 1.5, p: 1.25, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem', display: 'block' }}>
                  {kpi.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: kpi.color, fontSize: '0.875rem' }}>
                  {kpi.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 72, mb: 2 }}>
          {bars.map((h, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${h}%`,
                bgcolor: i === bars.length - 1 ? '#3b82f6' : '#e2e8f0',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s',
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.dark' }}>
              Actual Profit
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.dark' }}>
            ₹2,03,130
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function HeroSection() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 40%, #1e3a5f 100%)',
        color: '#fff',
        pt: { xs: 5, md: 8 },
        pb: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        className="marketing-grid-bg"
        sx={{ position: 'absolute', inset: 0, opacity: 0.4, maskImage: 'linear-gradient(to bottom, black 40%, transparent)' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Chip
          label="Amazon SP-API · India Marketplace"
          size="small"
          sx={{
            mb: 2.5,
            bgcolor: 'rgba(255,255,255,0.08)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.15)',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
          }}
        />

        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                mb: 2,
              }}
            >
              Know your real{' '}
              <Box component="span" sx={{ color: '#4ade80' }}>
                Amazon profit
              </Box>
              {' '}— not just revenue
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'rgba(226,232,240,0.85)', maxWidth: 480, mb: 3, lineHeight: 1.75, fontSize: '1rem' }}
            >
              Sync orders, inventory, and finance from Amazon India. Set purchase costs once.
              See actual profit per product with full P&L breakdown.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
              {highlights.map((item) => (
                <Chip
                  key={item}
                  icon={<CheckCircleIcon sx={{ fontSize: '15px !important', color: '#4ade80 !important' }} />}
                  label={item}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#f1f5f9',
                    border: '1px solid rgba(255,255,255,0.1)',
                    height: 30,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#fff',
                  color: '#0f172a',
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.25,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                Get started free
              </Button>
              <Button
                component={Link}
                href="/pricing"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.35)',
                  color: '#fff',
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 600,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                View pricing
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DashboardPreview />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', textAlign: 'center', mt: 1.5 }}>
              Sample dashboard preview
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
