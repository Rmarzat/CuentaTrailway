export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'pending';
  status: 'active' | 'suspended';
  createdAt: Date;
}

export interface AuthState {
  version: number;
  user: Omit<User, 'password'> | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  updatePassword: (userId: string, newPassword: string) => void;
  requestPasswordReset: (email: string) => string;
  validateResetCode: (email: string, code: string) => boolean;
  updatePasswordWithCode: (email: string, code: string, newPassword: string) => void;
}