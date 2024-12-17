import { useUsers } from '@/lib/hooks/use-users';
import { ExchangeRateModule } from '@/components/modules/ExchangeRateModule';
import { AdminSidebar } from './admin/AdminSidebar';
import { ActiveUsersList } from './admin/ActiveUsersList';
import { PendingUsersList } from './admin/PendingUsersList';
import { Header } from '@/components/layout/Header';
import { NotificationsPopover } from './admin/NotificationsPopover';

export function AdminPanel() {
  const {
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
  } = useUsers();

  return (
    <div className="min-h-screen bg-gradient flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingUsersCount={pendingUsers.length}
        showNotifications={showNotifications}
      />
      
      <div className="flex-1 pl-1">
        <Header 
          rightContent={
            pendingUsers.length > 0 && (
              <NotificationsPopover
                pendingUsers={pendingUsers}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
              />
            )
          }
        />

        <main className="max-w-7xl mx-auto p-6">
          <div className="space-y-6">
            {activeTab === 'exchange' && (
              <ExchangeRateModule />
            )}

            {activeTab === 'pending' && (
              <PendingUsersList
                users={pendingUsers}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
              />
            )}

            {activeTab === 'users' && (
              <ActiveUsersList
                users={activeUsers}
                onUpdateStatus={updateUserStatus}
                onResetPassword={updatePassword}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}