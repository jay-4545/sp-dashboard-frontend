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
import CloseIcon from '@mui/icons-material/Close';
import { useAccounts } from '@/hooks/useAccounts';
import { DRAWER_WIDTH } from './constants';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/accounts', label: 'Accounts', icon: PeopleIcon },
  { href: '/orders', label: 'Orders', icon: ShoppingCartIcon },
  { href: '/inventory', label: 'Inventory', icon: InventoryIcon },
  { href: '/products', label: 'Products', icon: SellIcon },
  { href: '/finance', label: 'Finance', icon: CurrencyRupeeIcon },
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'grey.400', letterSpacing: 2, fontSize: '0.625rem' }}>
            AMAZON SP-API
          </Typography>
          <Typography variant="subtitle2"  sx={{ fontWeight: 700 }}>
            Seller Dashboard
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: 'grey.400', display: { lg: 'none' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List sx={{ flex: 1, py: 1, px: 1 }}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            onClick={onClose}
            selected={pathname === href}
            sx={{
              borderRadius: 1,
              mb: 0.25,
              py: 0.75,
              color: pathname === href ? '#fff' : 'grey.300',
              bgcolor: pathname === href ? 'rgba(255,255,255,0.12)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
              '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
              <Icon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Typography variant="caption" sx={{ p: 1.5, color: 'grey.500', fontSize: '0.6875rem' }}>
        Private App · {accounts?.length || 0}/5 Accounts
      </Typography>
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
