'use client';

import { Box, Container, Typography } from '@mui/material';
import { PricingSection } from '@/components/marketing/PricingSection';

export default function PricingPage() {
  return (
    <>
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box className="marketing-grid-bg" sx={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em' }}>
            Pricing
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}
          >
            Choose the right plan for your business
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(226,232,240,0.8)', maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
            Start free with one Amazon India account. Scale to multiple accounts and full profit analytics as you grow.
          </Typography>
        </Container>
      </Box>
      <PricingSection showHeader={false} />
    </>
  );
}
