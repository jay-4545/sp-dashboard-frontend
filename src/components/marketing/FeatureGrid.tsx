'use client';

import { Box, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { FEATURES, STATS } from './constants';
import { SectionHeading } from './SectionHeading';

export function StatsBar() {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {STATS.map(({ value, label }) => (
            <Grid key={label} size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export function FeatureGrid() {
  return (
    <Box id="features" className="marketing-grid-bg" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionHeading
          overline="Features"
          title="Everything you need to run profitably on Amazon India"
          subtitle="From order sync to seller profit — one dashboard for your entire Amazon business."
        />

        <Grid container spacing={2.5}>
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                    borderColor: 'secondary.light',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'secondary.50',
                    color: 'secondary.main',
                    width: 44,
                    height: 44,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'rgba(59,130,246,0.2)',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.01em' }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export function HowItWorks() {
  const steps = [
    { step: '01', title: 'Connect your account', desc: 'Link your Amazon India seller account via SP-API OAuth.' },
    { step: '02', title: 'Sync your data', desc: 'Pull orders, inventory, finance events, and product listings.' },
    { step: '03', title: 'Set product costs', desc: 'Enter purchase prices once — reused for all profit calculations.' },
    { step: '04', title: 'Track real profit', desc: 'See actual profit per product and full P&L on your dashboard.' },
  ];

  return (
    <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <SectionHeading overline="How it works" title="Up and running in minutes" />

        <Grid container spacing={3}>
          {steps.map(({ step, title, desc }, i) => (
            <Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  pl: 2,
                  borderLeft: 3,
                  borderColor: i === 0 ? 'secondary.main' : 'grey.200',
                  height: '100%',
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: 'secondary.main', fontWeight: 800, display: 'block', mb: 1 }}
                >
                  Step {step}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, letterSpacing: '-0.01em' }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
