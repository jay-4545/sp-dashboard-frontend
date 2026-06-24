'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { LoginForm } from '@/components/marketing/LoginForm';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <Box
      suppressHydrationWarning
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 5, sm: 6 },
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          color: 'text.secondary',
          fontWeight: 500,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        Home
      </Button>

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 12px 40px rgba(15,23,42,0.08)',
          position: 'relative',
        }}
      >
        <Stack sx={{ alignItems: 'center', mb: 3.5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 12px rgba(15,23,42,0.15)',
            }}
          >
            <StorefrontIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your Amazon Seller Dashboard
          </Typography>
        </Stack>

        <LoginForm />
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center', position: 'relative' }}>
        New here?{' '}
        <Typography
          component={Link}
          href="/pricing"
          variant="body2"
          sx={{
            color: 'secondary.main',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View pricing
        </Typography>
      </Typography>
    </Box>
  );
}
