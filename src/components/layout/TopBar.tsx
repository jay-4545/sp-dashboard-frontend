'use client';

import { Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';
import { AccountSelector } from '@/components/shared/AccountSelector';
import { SyncStatus } from '@/components/shared/SyncStatus';
import { DateRangePicker } from '@/components/shared/DateRangePicker';

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
  showFilters?: boolean;
}

export function TopBar({ onMenuClick, title, showFilters = true }: TopBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="flex-1 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {showFilters && (
          <>
            <AccountSelector />
            <DateRangePicker />
          </>
        )}
        <SyncStatus />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
