import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useNavigate } from '@/lib/hooks/use-navigate';
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExchangeRateModule } from '@/components/modules/ExchangeRateModule';
import { AdminSidebar } from './AdminSidebar';
import { ActiveUsersList } from './ActiveUsersList';
import { PendingUsersList } from './PendingUsersList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { users, user: currentUser, logout, approveUser, rejectUser, updateUserStatus, updatePassword } = useAuthStore();
  const { navigateToEnterprises } = useNavigate();

  const pendingUsers = users.filter(u => u.role === 'pending');
  const activeUsers = users.filter(u => u.role === 'user' || u.role === 'admin');

  // Mostrar notificaciones cuando hay usuarios pendientes
  useEffect(() => {
    if (pendingUsers.length > 0 && activeTab !== 'pending') {
      setShowNotifications(true);
    }
  }, [pendingUsers.length, activeTab]);

  const handleLogout = () => {
    logout();
    navigateToEnterprises();
  };

  const handleApproveUser = async (userId: string) => {
    try {
      approveUser(userId);
      if (pendingUsers.length <= 1) {
        setShowNotifications(false);
        setActiveTab('users');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };
  
  const handleRejectUser = async (userId: string) => {
    try {
      rejectUser(userId);
      if (pendingUsers.length <= 1) {
        setShowNotifications(false);
        setActiveTab('users');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingUsersCount={pendingUsers.length}
        showNotifications={showNotifications}
      />
      
      <div className="flex-1 pl-1">
        <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[65px] flex items-center justify-between">
            <div className="flex-1"></div>
            <h1 className="text-xl font-bold text-white absolute left-1/2 -translate-x-1/2">
              Cuenta<span className="text-[#0f172a] text-[1.05em] font-black tracking-tight">T</span>
            </h1>
            <div className="flex-1 flex justify-end items-center space-x-4">
              {pendingUsers.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild onClick={() => setShowNotifications(false)}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "relative text-white hover:bg-white/10 h-9 w-9",
                        showNotifications && "animate-bounce-gentle"
                      )}
                    >
                      <Bell className="h-5 w-5" />
                      <span className={cn(
                        "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center",
                        "rounded-full bg-red-500 text-xs font-medium text-white",
                        showNotifications && "animate-pulse-gentle"
                      )}>
                        {pendingUsers.length}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 p-0 bg-[#1e293b] border-white/10"
                    align="end"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h4 className="text-sm font-medium text-white">
                        {pendingUsers.length} {pendingUsers.length === 1 ? 'Solicitud Pendiente' : 'Solicitudes Pendientes'}
                      </h4>
                    </div>
                    <div className="max-h-96 overflow-auto">
                      {pendingUsers.map(user => (
                        <div
                          key={user.id}
                          className="p-4 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {user.name}
                              </p>
                              <p className="text-xs text-white/60">
                                {user.email}
                              </p>
                              <p className="text-xs text-white/40">
                                {new Date(user.createdAt).toLocaleDateString('es-UY', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApproveUser(user.id)}
                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </header>

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