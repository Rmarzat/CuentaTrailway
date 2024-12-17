import { useCallback } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const { 
    user,
    login,
    logout,
    register,
    isLoading,
    error,
    clearError
  } = useAuthStore();
  
  const { toast } = useToast();

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (err) {
      toast({
        title: "Error al iniciar sesión",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive"
      });
      throw err;
    }
  }, [login, toast]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRegister = useCallback(async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
      toast({
        title: "Registro exitoso",
        description: "Tu solicitud ha sido enviada y está pendiente de aprobación",
        className: "bg-emerald-500/90 text-white border-none"
      });
    } catch (err) {
      toast({
        title: "Error en el registro",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive"
      });
      throw err;
    }
  }, [register, toast]);

  return {
    user,
    isLoading,
    error,
    clearError,
    handleLogin,
    handleLogout,
    handleRegister
  };
}