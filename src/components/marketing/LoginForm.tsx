'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import api from '@/lib/api';
import { setTokens } from '@/lib/auth';
import { useUserStore } from '@/store/userStore';
import { AuthResponse } from '@/types';
import { fontSize } from '@/theme/theme';

const DEMO_EMAIL = 'admin@example.com';
const DEMO_PASSWORD = 'Admin123!';

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#f8fafc',
    fontSize: fontSize.md,
    alignItems: 'center',
    minHeight: 46,
    transition: 'background-color 0.15s, box-shadow 0.15s',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused': {
      bgcolor: '#fff',
      boxShadow: '0 0 0 3px rgba(59,130,246,0.12)',
    },
    '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: 1 },
  },
  '& .MuiOutlinedInput-input': {
    py: 1.5,
  },
  '& .MuiInputAdornment-root': {
    alignItems: 'center',
    marginTop: '0 !important',
    height: 'auto',
  },
  '& .MuiInputLabel-root': {
    fontSize: fontSize.sm,
    fontWeight: 500,
  },
};

interface LoginFormProps {
  showDemoHint?: boolean;
}

export function LoginForm({ showDemoHint = true }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
      setTokens(data.token, data.refreshToken);
      useUserStore.getState().setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
          <InputLabel htmlFor="login-email">Email address</InputLabel>
          <OutlinedInput
            id="login-email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            startAdornment={
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
          <InputLabel htmlFor="login-password">Password</InputLabel>
          <OutlinedInput
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        disabled={loading || !email.trim() || !password}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginOutlinedIcon />}
        sx={{
          mt: 3,
          py: 1.25,
          borderRadius: 2,
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
          '&:hover': { boxShadow: '0 4px 14px rgba(59,130,246,0.35)' },
          '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
        }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      {showDemoHint && (
        <>
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, px: 1 }}>
              or try demo
            </Typography>
          </Divider>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: '#cbd5e1',
              bgcolor: '#f8fafc',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.75 }}>
                  Demo account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: fontSize.sm, color: 'text.primary', lineHeight: 1.6 }}
                >
                  {DEMO_EMAIL}
                  <br />
                  {DEMO_PASSWORD}
                </Typography>
              </Box>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={fillDemo}
                sx={{
                  flexShrink: 0,
                  borderColor: '#cbd5e1',
                  color: 'text.primary',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: 'secondary.main', bgcolor: '#fff' },
                }}
              >
                Use demo
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
