import { create } from 'zustand';
import { User } from '@/types';

const USER_KEY = 'auth_user';

function loadUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: () => boolean;
  hydrate: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_KEY);
    }
    set({ user });
  },
  isAdmin: () => get().user?.role === 'admin',
  hydrate: () => set({ user: loadUser() }),
}));
