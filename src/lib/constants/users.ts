import type { User } from '@/lib/types/auth';

export const adminUser: User = {
  id: '1',
  email: 'admin@sistema.com',
  name: 'Administrador',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  password: '123456'
};