'use client';

import Link from 'next/link';
import { Box, Container, Typography, Divider } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

export function MarketingFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f172a', color: '#94a3b8', mt: 0 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
          <Box sx={{ maxWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                }}
              >
                <StorefrontIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Seller Dashboard
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
              Amazon SP-API private dashboard for India sellers. Track orders, inventory, finance, and real profit.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: '#e2e8f0', display: 'block', mb: 1.5 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { href: '/#features', label: 'Features' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/login', label: 'Sign in' },
              ].map(({ href, label }) => (
                <Typography
                  key={href}
                  component={Link}
                  href={href}
                  variant="body2"
                  sx={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#fff' } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: '#e2e8f0', display: 'block', mb: 1.5 }}>
              Marketplace
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Amazon India
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
              A21TJRUUN4KGV
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 3 }} />
        <Typography variant="caption" sx={{ color: '#475569' }}>
          © {new Date().getFullYear()} Seller Dashboard · Private SP-API App
        </Typography>
      </Container>
    </Box>
  );
}
