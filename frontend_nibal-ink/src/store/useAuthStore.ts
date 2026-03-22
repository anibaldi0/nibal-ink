// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  setLogin: (token: string, email: string) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      userEmail: null,
      setLogin: (token, email) => set({ token, isAuthenticated: true, userEmail: email }),
      setLogout: () => set({ token: null, isAuthenticated: false, userEmail: null }),
    }),
    { name: 'auth-storage' } // Esto lo guarda en LocalStorage automáticamente
  )
);