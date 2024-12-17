import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/lib/types/auth';

interface AuthState {
  version: number;
  user: User | null;
  users: User[];
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  resetPassword: (userId: string, newPassword: string) => void;
  requestPasswordReset: (email: string) => string;
  validateResetCode: (email: string, code: string) => boolean;
  updatePassword: (email: string, code: string, newPassword: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
}

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

// Almacena códigos de recuperación temporales
const resetCodes: { [key: string]: { code: string; expires: Date } } = {};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      version: CURRENT_VERSION,
      user: null,
      users: [adminUser],
      login: (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (!user) throw new Error('Usuario no encontrado');
        if (user.status === 'suspended') throw new Error('Usuario suspendido');
        if (password !== user.password) throw new Error('Contraseña incorrecta');
        const { password: _, ...safeUser } = user;
        set({ user: safeUser });
      },
      register: (name, email, password) => {
        const exists = get().users.some(u => u.email === email);
        if (exists) throw new Error('El correo ya está registrado');
        
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          name,
          role: 'pending',
          status: 'active',
          createdAt: new Date(),
          password
        };
        
        set(state => ({
          users: [...state.users, newUser]
        }));
      },
      logout: () => set({ user: null }),
      approveUser: (userId) => set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, role: 'user' } : user
        )
      })),
      rejectUser: (userId) => set(state => ({
        users: state.users.filter(user => user.id !== userId)
      })),
      resetPassword: (userId, newPassword) => set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, password: newPassword } : user
        )
      })),
      requestPasswordReset: (email) => {
        const user = get().users.find(u => u.email === email);
        if (!user) throw new Error('Usuario no encontrado');
        
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        
        resetCodes[email] = { code, expires };
        return code;
      },
      validateResetCode: (email, code) => {
        const resetData = resetCodes[email];
        if (!resetData) return false;
        if (new Date() > resetData.expires) {
          delete resetCodes[email];
          return false;
        }
        return resetData.code === code;
      },
      updatePassword: (email, code, newPassword) => {
        if (!get().validateResetCode(email, code)) {
          throw new Error('Código inválido o expirado');
        }
        
        set(state => ({
          users: state.users.map(user =>
            user.email === email ? { ...user, password: newPassword } : user
          )
        }));
        
        delete resetCodes[email];
      },
      updateUserStatus: (userId, status) => set(state => {
        // Don't allow suspending admin users
        const user = state.users.find(u => u.id === userId);
        if (user?.role === 'admin') {
          throw new Error('No se puede suspender a un administrador');
        }

        return {
          users: state.users.map(user =>
            user.id === userId ? { ...user, status } : user
          ),
          // If the suspended user is currently logged in, log them out
          user: state.user?.id === userId && status === 'suspended' ? null : state.user
        };
      })
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