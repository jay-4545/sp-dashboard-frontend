import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subDays, format } from 'date-fns';

interface FilterState {
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;
  resetDateRange: () => void;
}

const defaultEnd = format(new Date(), 'yyyy-MM-dd');
const defaultStart = format(subDays(new Date(), 30), 'yyyy-MM-dd');

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      startDate: defaultStart,
      endDate: defaultEnd,
      setDateRange: (start, end) => set({ startDate: start, endDate: end }),
      resetDateRange: () => set({ startDate: defaultStart, endDate: defaultEnd }),
    }),
    { name: 'filter-store' }
  )
);
