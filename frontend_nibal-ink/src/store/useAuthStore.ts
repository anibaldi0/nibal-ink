// frontend_nibal-ink/src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null; 
  setLogin: (token: string, email: string, name?: string) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      userEmail: null,
      userName: null,
      
      setLogin: (token, email, name) => {
        // LÓGICA REFORMULADA:
        // 1. Si 'name' existe (viene de la DB), lo usamos tal cual (Prisma Astral 22).
        // 2. Si no viene (fallo de DB o registro viejo), intentamos el split del email.
        // 3. Si no hay nada, un fallback genérico.
        
        let finalName = name;

        if (!finalName || finalName.trim() === "") {
          finalName = email ? email.split('@')[0] : "Usuario";
        }

        set({ 
          token, 
          isAuthenticated: true, 
          userEmail: email, 
          userName: finalName 
        });
      },

      setLogout: () => set({ 
        token: null, 
        isAuthenticated: false, 
        userEmail: null, 
        userName: null 
      }),
    }),
    { 
      name: 'auth-storage',
    } 
  )
);