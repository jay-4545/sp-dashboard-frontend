'use client';

import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSyncStatus } from '@/hooks/useFinance';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function SyncStatus() {
  const { data, isLoading } = useSyncStatus();

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Sync...
      </div>
    );
  }

  const latestJob = data?.recentJobs?.[0];
  if (!latestJob) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
        <RefreshCw className="h-3 w-3" />
        No syncs yet
      </div>
    );
  }

  const statusConfig = {
    running: { icon: Loader2, color: 'text-blue-600 bg-blue-50', spin: true },
    success: { icon: CheckCircle, color: 'text-green-600 bg-green-50', spin: false },
    failed: { icon: AlertCircle, color: 'text-red-600 bg-red-50', spin: false },
  };

  const config = statusConfig[latestJob.status] || statusConfig.running;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.color
      )}
      title={latestJob.error_message || undefined}
    >
      <Icon className={cn('h-3 w-3', config.spin && 'animate-spin')} />
      <span className="hidden sm:inline">
        {latestJob.sync_type} · {formatDateTime(latestJob.finished_at || latestJob.started_at)}
      </span>
    </div>
  );
}
