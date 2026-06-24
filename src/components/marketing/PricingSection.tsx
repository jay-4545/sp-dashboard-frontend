'use client';

import Link from 'next/link';
import { Box, Container, Typography, Grid, Paper, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { PRICING_PLANS } from './constants';
import { SectionHeading } from './SectionHeading';

interface PricingSectionProps {
  showHeader?: boolean;
  compact?: boolean;
}

function formatPrice(price: number | null) {
  if (price === null) return 'Custom';
  if (price === 0) return 'Free';
  return `₹${price.toLocaleString('en-IN')}`;
}

export function PricingSection({ showHeader = true, compact = false }: PricingSectionProps) {
  const plans = compact ? PRICING_PLANS.slice(0, 3) : PRICING_PLANS;

  return (
    <Box id="pricing" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {showHeader && (
          <SectionHeading
            overline="Pricing"
            title="Simple plans for every seller"
            subtitle="Start free with one account. Upgrade as you grow — all plans include Amazon India SP-API sync."
          />
        )}

        <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
          {plans.map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 3.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  bgcolor: 'background.paper',
                  borderColor: plan.highlighted ? 'secondary.main' : 'divider',
                  borderWidth: plan.highlighted ? 2 : 1,
                  boxShadow: plan.highlighted ? '0 16px 40px rgba(59,130,246,0.12)' : 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(15,23,42,0.08)' },
                }}
              >
                {plan.highlighted && (
                  <Chip
                    label="Most popular"
                    size="small"
                    color="secondary"
                    sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 600 }}
                  />
                )}

                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography component="span" variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                    {formatPrice(plan.price)}
                  </Typography>
                  {plan.price !== null && plan.price > 0 && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{plan.period}
                    </Typography>
                  )}
                  {plan.price === 0 && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}{plan.period}
                    </Typography>
                  )}
                </Box>

                <List dense disablePadding sx={{ flex: 1, mb: 2 }}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} disableGutters sx={{ py: 0.375 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        slotProps={{ primary: { variant: 'body2', sx: { fontSize: '0.8125rem' } } }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  component={Link}
                  href="/login"
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  color={plan.highlighted ? 'secondary' : 'primary'}
                  fullWidth
                  size="medium"
                  sx={{ py: 1 }}
                >
                  {plan.cta}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          All prices in INR · GST extra as applicable · 14-day free trial on paid plans
        </Typography>
      </Container>
    </Box>
  );
}

export function CtaBanner() {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        className="marketing-grid-bg"
        sx={{ position: 'absolute', inset: 0, opacity: 0.3 }}
      />
      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.025em', fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Ready to see your real profit?
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(226,232,240,0.8)', mb: 3.5, lineHeight: 1.7 }}>
          Connect your Amazon India account and start tracking in minutes.
        </Typography>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#fff',
            color: '#0f172a',
            fontWeight: 700,
            px: 4,
            py: 1.25,
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          Get started free
        </Button>
      </Container>
    </Box>
  );
}
