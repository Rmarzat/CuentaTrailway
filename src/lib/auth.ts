import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState } from './types/auth';

const CURRENT_VERSION = 1;

const adminUser: User = {
  id: '1',
  email: 'admin@sistema.com',
  name: 'Administrador',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  password: '123456'
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      version: CURRENT_VERSION,
      user: null,
      users: [adminUser],
      setUser: (user) => set({ user }),
      updateUserRole: (userId, role) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, role } : u
          ),
        })),
      updateUserStatus: (userId, status) => 
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status } : u
          ),
          // Log out suspended user if they're currently logged in
          user: state.user?.id === userId && status === 'suspended' ? null : state.user
        })),
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      removeUser: (userId) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        })),
    }),
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
      },
      migrate: (persistedState: any) => {
        if (!persistedState.version || persistedState.version < CURRENT_VERSION) {
          return {
            version: CURRENT_VERSION,
            user: null,
            users: persistedState.users?.map((user: any) => ({
              ...user,
              createdAt: new Date(user.createdAt || new Date()),
              role: user.role || 'pending',
              status: user.status || 'active',
              password: user.password || '123456'
            })) || [adminUser]
          };
        }
        return persistedState as AuthState;
      },
      version: CURRENT_VERSION
    }
  )
);