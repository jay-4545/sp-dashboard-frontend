'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { isAuthenticated } from '@/lib/auth';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboardHref = loggedIn ? '/dashboard' : '/login';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: scrolled ? 'divider' : 'transparent',
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64, gap: 2 }}>
            <Box
              component={Link}
              href="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', color: 'inherit' }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.25,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.2)',
                }}
              >
                <StorefrontIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  Seller Dashboard
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                  Amazon India · SP-API
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1, ml: 3 }}>
              {navLinks.map(({ href, label }) => (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: pathname === href ? 'primary.main' : 'text.secondary',
                    px: 2,
                    '&:hover': { color: 'primary.main', bgcolor: 'grey.50' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.25, ml: 'auto' }}>
              <Button
                component={Link}
                href={dashboardHref}
                variant="text"
                color="inherit"
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              >
                {loggedIn ? 'Dashboard' : 'Sign in'}
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  fontWeight: 700,
                  px: 2.5,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.2)',
                }}
              >
                Get started
              </Button>
            </Box>

            <IconButton
              sx={{ display: { md: 'none' }, ml: 'auto' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 1 }}>
            {navLinks.map(({ href, label }) => (
              <ListItemButton key={href} component={Link} href={href} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 1 }}>
                <ListItemText primary={label} slotProps={{ primary: { fontWeight: 600 } }} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItemButton component={Link} href={dashboardHref} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 1 }}>
              <ListItemText primary={loggedIn ? 'Dashboard' : 'Sign in'} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/login"
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 1, bgcolor: 'primary.main', color: '#fff', mt: 1, '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <ListItemText primary="Get started" slotProps={{ primary: { fontWeight: 700, color: '#fff' } }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
