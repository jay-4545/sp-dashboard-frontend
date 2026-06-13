'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Users },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/finance', label: 'Finance', icon: DollarSign },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-60 flex-col bg-slate-800 text-white transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Amazon SP-API
            </p>
            <h1 className="text-lg font-bold">Seller Dashboard</h1>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-700 p-4 text-xs text-slate-400">
          Private App · 5 Accounts
        </div>
      </aside>
    </>
  );
}
