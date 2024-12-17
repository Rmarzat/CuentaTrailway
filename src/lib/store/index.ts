import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '@/lib/types/auth';
import { createAuthSlice } from './slices/auth.slice';

export const useAuthStore = create<AuthState>()(
  persist(
    createAuthSlice,
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        users: state.users.map(user => ({
          ...user,
          createdAt: user.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.users = state.users.map(user => ({
            ...user,
            createdAt: new Date(user.createdAt)
          }));
        }
      }
    }
  )
);