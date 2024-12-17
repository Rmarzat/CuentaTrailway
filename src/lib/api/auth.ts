import axios from 'axios';
import type { User } from '@/lib/types/auth';

const api = axios.create({
  baseURL: '/.netlify/functions/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (!response.data?.user) {
        throw new Error('Error al iniciar sesión');
      }
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
      }
      throw error;
    }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (!response.data?.user) {
        throw new Error('Error en el registro');
      }
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Error al registrarse');
      }
      throw error;
    }
  }
};