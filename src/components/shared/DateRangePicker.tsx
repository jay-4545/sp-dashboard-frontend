'use client';

import { useFilterStore } from '@/store/filterStore';

export function DateRangePicker() {
  const { startDate, endDate, setDateRange } = useFilterStore();

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setDateRange(e.target.value, endDate)}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
      />
      <span className="text-slate-400 text-sm">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setDateRange(startDate, e.target.value)}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
