import { useAuthStore } from '@/lib/store/auth';
import { EnterpriseGrid } from '@/components/enterprise/EnterpriseGrid';
import { Card } from '@/components/ui/card';
import { Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/hooks/use-navigate';

export function UserDashboard() {
  const { user, logout } = useAuthStore();
  const { navigateToEnterprises } = useNavigate();

  const handleLogout = () => {
    logout();
    navigateToEnterprises();
  };

  if (!user) return null;

  if (user.role === 'pending') {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center p-6">
        <Card className="p-6 bg-white/5 border-white/10 max-w-md w-full">
          <div className="flex items-center space-x-4 text-white">
            <Clock className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-lg font-semibold">Cuenta Pendiente de Aprobación</h2>
              <p className="text-white/70 mt-1">
                Tu cuenta está siendo revisada por nuestros administradores. Te notificaremos cuando sea aprobada.
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-6 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient">
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[65px] flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            Bienvenido, {user.name}
          </h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-bold text-white text-left">
            Mis Empresas
          </h2>
          <p className="text-white/60 text-left mt-1">
            Selecciona una empresa existente o crea una nueva
          </p>
        </div>
        <EnterpriseGrid />
      </main>
    </div>
  );
}