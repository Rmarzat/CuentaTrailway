import { StateCreator } from 'zustand';
import type { AuthState, User } from '@/lib/types/auth';
import api from '@/lib/api';

export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  version: 1,
  user: null,
  users: [],
  setUser: (user) => set({ user }),
  updateUserRole: (userId, role) => set(state => ({
    users: state.users.map(user =>
      user.id === userId ? { ...user, role } : user
    )
  })),
  addUser: (user) => set(state => ({
    users: [...state.users, user]
  })),
  removeUser: (userId) => set(state => ({
    users: state.users.filter(user => user.id !== userId)
  })),
  
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user } = response.data;
      if (!user) {
        throw new Error('Error al iniciar sesión');
      }
      set({ user });
    } catch (error) {
      throw error;
    }
  },
  
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { success, user } = response.data;
      if (!success || !user) {
        throw new Error('Error en el registro');
      }
      set(state => ({
        users: [...state.users, user]
      }));
    } catch (error) {
      throw error;
    }
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
  
  updateUserStatus: (userId, status) => set(state => {
    const user = state.users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      throw new Error('No se puede suspender a un administrador');
    }

    return {
      users: state.users.map(user =>
        user.id === userId ? { ...user, status } : user
      ),
      user: state.user?.id === userId && status === 'suspended' ? null : state.user
    };
  })
});