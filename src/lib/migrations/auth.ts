import type { AuthState } from '@/lib/types/auth';
import { adminUser } from '@/lib/constants/users';

export const migrateAuthState = (persistedState: any): AuthState => {
  if (!persistedState.version || persistedState.version < 1) {
    // Migration from version 0 to 1
    return {
      version: 1,
      user: null,
      isLoading: false,
      error: null,
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
};