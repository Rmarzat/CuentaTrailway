import { User } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';

interface PendingUsersListProps {
  users: User[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function PendingUsersList({ users, onApprove, onReject }: PendingUsersListProps) {
  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-white/70 text-center py-4">
          No hay solicitudes pendientes
        </p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="space-y-1">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-sm text-white/70">{user.email}</p>
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
            <div className="flex space-x-4">
              <Button
                onClick={() => onApprove(user.id)}
                variant="ghost"
                className="text-white/60 hover:text-emerald-300 hover:bg-emerald-500/10"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Aprobar
              </Button>
              <Button
                onClick={() => onReject(user.id)}
                variant="ghost"
                className="text-white/60 hover:text-red-300 hover:bg-red-500/10"
              >
                <UserX className="w-4 h-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}