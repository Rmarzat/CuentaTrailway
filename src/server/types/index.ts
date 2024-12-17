export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'pending';
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRate {
  date: string;
  currency: string;
  rate: number;
  source?: string;
}

export interface ApiError extends Error {
  status?: number;
}