import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState } from '@/lib/types/auth';
import { adminUser } from '@/lib/constants/users';
import { validatePassword } from '@/lib/utils/auth';

// Store reset codes in memory
const resetCodes: { [key: string]: { code: string; expires: Date } } = {};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      version: 1,
      user: null,
      users: [adminUser],
      isLoading: false,
      error: null,
      clearError: () => set({ error: null }),
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const users = get().users;
          const user = users.find(u => u.email === email);
          
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
          
          if (user.status === 'suspended') {
            throw new Error('Usuario suspendido');
          }
          
          if (user.password !== password) {
            throw new Error('Contraseña incorrecta');
          }

          if (user.role === 'pending') {
            throw new Error('Tu cuenta está pendiente de aprobación');
          }

          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isLoading: false,
            error: null 
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
          set({ error: message, isLoading: false, user: null });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const users = get().users;
          if (users.some(u => u.email === email)) {
            throw new Error('El correo ya está registrado');
          }

          validatePassword(password);

          const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
            role: 'pending',
            status: 'active',
            createdAt: new Date()
          };

          set(state => ({
            users: [...state.users, newUser],
            isLoading: false,
            error: null
          }));

          return newUser;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error al registrarse';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          error: null, 
          isLoading: false 
        });
      },

      approveUser: (userId) => set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, role: 'user' } : user
        )
      })),

      rejectUser: (userId) => set(state => ({
        users: state.users.filter(user => user.id !== userId)
      })),

      updateUserStatus: (userId, status) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user?.role === 'admin') {
          throw new Error('No se puede suspender a un administrador');
        }

        return {
          users: state.users.map(user =>
            user.id === userId ? { ...user, status } : user
          ),
          // Si el usuario suspendido es el actual, cerrar sesión
          user: state.user?.id === userId && status === 'suspended' ? null : state.user
        };
      }),

      updatePassword: (userId, newPassword) => {
        validatePassword(newPassword);
        set(state => ({
          users: state.users.map(user =>
            user.id === userId ? { ...user, password: newPassword } : user
          )
        }));
      },

      requestPasswordReset: (email) => {
        const user = get().users.find(u => u.email === email);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        
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

      updatePasswordWithCode: (email, code, newPassword) => {
        if (!get().validateResetCode(email, code)) {
          throw new Error('Código inválido o expirado');
        }
        
        validatePassword(newPassword);
        
        set(state => ({
          users: state.users.map(user =>
            user.email === email ? { ...user, password: newPassword } : user
          )
        }));
        
        delete resetCodes[email];
      }
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
          // Limpiar estado al recargar
          state.user = null;
          state.isLoading = false;
          state.error = null;
        }
      }
    }
  )
);