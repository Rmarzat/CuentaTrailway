import { User } from '@/lib/types/auth';
import api from '../api';

export class AuthService {
  static async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  static async register(name: string, email: string, password: string) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }

  static async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const response = await api.post(`/auth/status/${userId}`, { status });
    return response.data;
  }
}