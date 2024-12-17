import { useState } from 'react';
import { User } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Key, Save, X, Ban, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface ActiveUsersListProps {
  users: User[];
  onUpdateStatus: (userId: string, status: 'active' | 'suspended') => void;
  onResetPassword: (userId: string, newPassword: string) => void;
}

export function ActiveUsersList({ 
  users, 
  onUpdateStatus,
  onResetPassword 
}: ActiveUsersListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handlePasswordReset = (userId: string) => {
    if (!newPassword.trim()) return;
    onResetPassword(userId, newPassword);
    setNewPassword('');
    setSelectedUserId(null);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-white">{user.name}</p>
              {user.status === 'suspended' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  Suspendido
                </span>
              )}
            </div>
            <p className="text-sm text-white/70">{user.email}</p>
            <p className="text-xs text-white/50">
              Rol: {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-white/50">
                Contraseña actual: {showPasswords[user.id] ? user.password : '••••••'}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-white/40 hover:text-white/60"
                onClick={() => togglePasswordVisibility(user.id)}
              >
                {showPasswords[user.id] ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {selectedUserId === user.id ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="h-9 w-40 bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={() => handlePasswordReset(user.id)}
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-emerald-300 hover:bg-emerald-500/10"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setNewPassword('');
                    setSelectedUserId(null);
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-red-300 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => setSelectedUserId(user.id)}
                  variant="ghost"
                  className="text-white/60 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                {user.role !== 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-white/60",
                          user.status === 'active'
                            ? "hover:text-red-300 hover:bg-red-500/10"
                            : "hover:text-emerald-300 hover:bg-emerald-500/10"
                        )}
                      >
                        {user.status === 'active' ? (
                          <>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspender
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reactivar
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1e293b] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          {user.status === 'active' 
                            ? '¿Suspender usuario?' 
                            : '¿Reactivar usuario?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                          {user.status === 'active'
                            ? 'El usuario no podrá acceder al sistema mientras esté suspendido.'
                            : 'El usuario podrá volver a acceder al sistema.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onUpdateStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                          className={cn(
                            user.status === 'active'
                              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                              : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          )}
                        >
                          {user.status === 'active' ? 'Suspender' : 'Reactivar'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}