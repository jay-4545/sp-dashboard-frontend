'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/finance': 'Finance',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  const title = pageTitles[pathname] || 'Dashboard';
  const showFilters = pathname !== '/accounts';

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-60">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          showFilters={showFilters}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
