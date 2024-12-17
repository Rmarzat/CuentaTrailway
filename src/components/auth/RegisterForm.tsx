import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.email.trim()) {
        throw new Error('El correo electrónico es requerido');
      }
      if (!formData.password.trim()) {
        throw new Error('La contraseña es requerida');
      }
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      await register(formData.name, formData.email, formData.password);
      
      toast({
        title: "Registro exitoso",
        description: "Tu solicitud ha sido enviada y está pendiente de aprobación.",
        variant: "default",
        className: "bg-emerald-500/90 text-white border-none"
      });

      // Limpiar formulario
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      toast({
        title: "Error en el registro",
        description: err instanceof Error ? err.message : 'Error al registrarse',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Nombre Completo"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        disabled={isLoading}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
      />
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
        <UserPlus className="w-4 h-4 mr-2" />
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
}