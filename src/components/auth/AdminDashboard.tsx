import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { Shield, UserCheck, UserX, Users, Ban, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
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

export function AdminDashboard() {
  const users = useAuthStore(state => state.users);
  const updateUserStatus = useAuthStore(state => state.updateUserStatus);
  const approveUser = useAuthStore(state => state.approveUser);
  const rejectUser = useAuthStore(state => state.rejectUser);
  const pendingUsers = users.filter((user) => user.role === 'pending');
  const approvedUsers = users.filter((user) => user.role === 'user');
  const [userToUpdate, setUserToUpdate] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    try {
      updateUserStatus(userId, user.status === 'active' ? 'suspended' : 'active');
      setUserToUpdate(null);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Panel de Administración</h2>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-white/10 mb-6">
            <TabsTrigger value="pending" className="text-white data-[state=active]:bg-white/20">
              <UserCheck className="w-4 h-4 mr-2" />
              Solicitudes Pendientes ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Usuarios Aprobados ({approvedUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white">Nombre</TableHead>
                    <TableHead className="text-white">Correo Electrónico</TableHead>
                    <TableHead className="text-white">Estado</TableHead>
                    <TableHead className="text-white">Fecha de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={4} className="text-center text-white/70">
                        No hay solicitudes pendientes
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">{user.name}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20">
                            Pendiente
                          </span>
                        </TableCell>
                        <TableCell className="text-white">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => approveUser(user.id)}
                              variant="ghost"
                              className="text-white/60 hover:text-emerald-300 hover:bg-emerald-500/10"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Aprobar
                            </Button>
                            <Button
                              onClick={() => rejectUser(user.id)}
                              variant="ghost"
                              className="text-white/60 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Rechazar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white">Nombre</TableHead>
                    <TableHead className="text-white">Correo Electrónico</TableHead>
                    <TableHead className="text-white">Estado</TableHead>
                    <TableHead className="text-white">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={4} className="text-center text-white/70">
                        No hay usuarios aprobados
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvedUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">{user.name}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                            user.status === 'active'
                              ? "bg-emerald-400/10 text-emerald-500 ring-emerald-400/20"
                              : "bg-red-400/10 text-red-500 ring-red-400/20"
                          )}>
                            {user.status === 'active' ? 'Activo' : 'Suspendido'}
                          </span>
                        </TableCell>
                        <TableCell>
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
                                  onClick={() => handleStatusChange(user.id)}
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;