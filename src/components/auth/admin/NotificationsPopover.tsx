import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatUserDate } from '@/lib/utils/auth';
import type { User } from '@/lib/types/auth';

interface NotificationsPopoverProps {
  pendingUsers: User[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function NotificationsPopover({
  pendingUsers,
  showNotifications,
  setShowNotifications,
  onApprove,
  onReject
}: NotificationsPopoverProps) {
  return (
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
                    {formatUserDate(user.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApprove(user.id)}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReject(user.id)}
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
  );
}