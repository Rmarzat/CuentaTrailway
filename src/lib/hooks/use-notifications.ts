```typescript
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useNotificationStore } from '@/lib/store/notification';

export function useNotifications() {
  const { users } = useAuthStore();
  const { showNotifications, setShowNotifications } = useNotificationStore();

  const pendingUsers = users.filter(u => u.role === 'pending');

  // Check for new notifications
  useEffect(() => {
    if (pendingUsers.length > 0) {
      setShowNotifications(true);
    }
  }, [pendingUsers.length, setShowNotifications]);

  const clearNotifications = useCallback(() => {
    setShowNotifications(false);
  }, [setShowNotifications]);

  return {
    pendingUsers,
    showNotifications,
    clearNotifications
  };
}
```