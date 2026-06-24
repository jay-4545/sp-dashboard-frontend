'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import { useAccounts } from '@/hooks/useAccounts';
import { DRAWER_WIDTH } from './constants';

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
      { href: '/accounts', label: 'Accounts', icon: PeopleIcon },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/orders', label: 'Orders', icon: ShoppingCartIcon },
      { href: '/inventory', label: 'Inventory', icon: InventoryIcon },
      { href: '/products', label: 'Products', icon: SellIcon },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/seller-profit', label: 'Seller Profit', icon: TrendingUpIcon },
      { href: '/finance', label: 'Finance', icon: CurrencyRupeeIcon },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function DrawerContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: accounts } = useAccounts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1e293b', color: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1.5, borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'grey.400', letterSpacing: 1.5, fontSize: '0.5625rem' }}>
            AMAZON SP-API
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            Seller Dashboard
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.5625rem' }}>
            India · Private App
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: 'grey.400', display: { lg: 'none' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flex: 1, py: 1, px: 0.75, overflowY: 'auto' }}>
        {navSections.map((section) => (
          <Box key={section.label} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                display: 'block',
                color: 'grey.500',
                fontSize: '0.5625rem',
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {section.label}
            </Typography>
            <List disablePadding>
              {section.items.map(({ href, label, icon: Icon }) => {
                const selected = pathname === href;
                return (
                  <ListItemButton
                    key={href}
                    component={Link}
                    href={href}
                    onClick={onClose}
                    selected={selected}
                    sx={{
                      borderRadius: 1,
                      mb: 0.25,
                      py: 0.625,
                      minHeight: 34,
                      color: selected ? '#fff' : 'grey.300',
                      bgcolor: selected ? 'rgba(255,255,255,0.12)' : 'transparent',
                      borderLeft: selected ? 3 : 0,
                      borderColor: 'secondary.main',
                      pl: selected ? 1.25 : 1.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                      '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                      <Icon sx={{ fontSize: 17 }} />
                    </ListItemIcon>
                    <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: selected ? 600 : 500 } } }} />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 1.25 }}>
        <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.625rem', display: 'block' }}>
          {accounts?.length || 0}/5 accounts connected
        </Typography>
      </Box>
    </Box>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <DrawerContent onClose={onClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </>
  );
}
