import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PasswordResetDialog } from './PasswordResetDialog';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const login = useAuthStore(state => state.login);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Por favor complete todos los campos');
      }

      await login(formData.email, formData.password);
    } catch (err) {
      toast({
        title: "Error al iniciar sesión",
        description: err instanceof Error ? err.message : 'Error desconocido',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
        
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-white/40 hover:text-white/60"
            disabled={isLoading}
          >
            {showPassword ? 
              <EyeOff className="w-4 h-4" /> : 
              <Eye className="w-4 h-4" />
            }
          </button>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-white/20 hover:bg-white/30 text-white"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <p className="text-center">
          <button
            type="button"
            onClick={() => setShowResetDialog(true)}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
      </form>

      <PasswordResetDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      />
    </>
  );
}