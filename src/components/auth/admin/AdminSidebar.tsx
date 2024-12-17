import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Users, UserCheck, DollarSign } from 'lucide-react';
import { UserProfile } from '../UserProfile';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingUsersCount: number;
  showNotifications: boolean;
}

export function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  pendingUsersCount,
  showNotifications 
}: AdminSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="fixed left-0 top-0 h-full z-50 w-1"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={cn(
        "h-full bg-[#1e293b]/70 backdrop-blur-sm transition-all duration-200 absolute top-0",
        "flex flex-col border-r border-white/5",
        isExpanded ? "left-0 w-64" : "-translate-x-full w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-[65px] px-4 flex items-center border-b border-white/5">
            <h2 className="text-lg font-semibold text-white/90 whitespace-nowrap">
              Panel de Administración
            </h2>
          </div>

          <div className="flex-1 p-2">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('users')}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150",
                  "text-left",
                  activeTab === 'users' 
                    ? "text-white bg-white/10" 
                    : "text-white hover:bg-white/[0.02]"
                )}
              >
                <Users className="w-4 h-4 mr-3" />
                <span>Usuarios Activos</span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150",
                  "text-left relative",
                  activeTab === 'pending' 
                    ? "text-white bg-white/10" 
                    : "text-white hover:bg-white/[0.02]"
                )}
              >
                <UserCheck className="w-4 h-4 mr-3" />
                <span>Solicitudes Pendientes</span>
                {pendingUsersCount > 0 && (
                  <span className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center",
                    "rounded-full bg-red-500 text-xs font-medium text-white",
                    showNotifications && "animate-pulse"
                  )}>
                    {pendingUsersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('exchange')}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150",
                  "text-left",
                  activeTab === 'exchange' 
                    ? "text-white bg-white/10" 
                    : "text-white hover:bg-white/[0.02]"
                )}
              >
                <DollarSign className="w-4 h-4 mr-3" />
                <span>Tipos de Cambio</span>
              </button>
            </nav>
          </div>

          <div className="p-4 border-t border-white/5">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}