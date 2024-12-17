import type { User } from '@/lib/types/auth';

export const formatUserDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const filterUsers = (users: User[]) => {
  return {
    pendingUsers: users.filter(u => u.role === 'pending'),
    activeUsers: users.filter(u => u.role === 'user' || u.role === 'admin')
  };
};

export const validatePassword = (password: string) => {
  if (!password.trim()) {
    throw new Error('La contraseña no puede estar vacía');
  }
  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
  return true;
};