import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { filterUsers } from '@/lib/utils/auth';
import type { User } from '@/lib/types/auth';

export function useUsers() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  
  const { 
    users,
    approveUser,
    rejectUser,
    updateUserStatus,
    updatePassword
  } = useAuthStore();

  const { pendingUsers, activeUsers } = filterUsers(users);

  useEffect(() => {
    if (pendingUsers.length > 0 && activeTab !== 'pending') {
      setShowNotifications(true);
    }
  }, [pendingUsers.length, activeTab]);

  const handleApproveUser = useCallback(async (userId: string) => {
    try {
      approveUser(userId);
      if (pendingUsers.length <= 1) {
        setShowNotifications(false);
        setActiveTab('users');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  }, [approveUser, pendingUsers.length]);

  const handleRejectUser = useCallback(async (userId: string) => {
    try {
      rejectUser(userId);
      if (pendingUsers.length <= 1) {
        setShowNotifications(false);
        setActiveTab('users');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  }, [rejectUser, pendingUsers.length]);

  return {
    activeTab,
    setActiveTab,
    showNotifications,
    setShowNotifications,
    pendingUsers,
    activeUsers,
    handleApproveUser,
    handleRejectUser,
    updateUserStatus,
    updatePassword
  };
}