import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetDialog({ isOpen, onClose }: PasswordResetDialogProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { requestPasswordReset, validateResetCode, updatePassword } = useAuthStore();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resetCode = requestPasswordReset(email);
      toast({
        title: "Código enviado",
        description: `Se ha enviado un código de recuperación a ${email}`,
        className: "bg-emerald-500/90 text-white border-none"
      });
      setStep(2);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al solicitar recuperación',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateResetCode(email, code)) {
        throw new Error('Código inválido o expirado');
      }

      updatePassword(email, code, newPassword);
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
        className: "bg-emerald-500/90 text-white border-none"
      });

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al actualizar contraseña',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1e293b] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">
            {step === 1 ? 'Recuperar Contraseña' : 'Ingresar Código'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {step === 1 
              ? 'Ingresa tu correo electrónico para recibir un código de recuperación'
              : 'Ingresa el código recibido y tu nueva contraseña'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white/20 hover:bg-white/30 text-white"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {isLoading ? 'Enviando...' : 'Solicitar Código'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <Input
              type="text"
              placeholder="Código de Recuperación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <KeyRound className="w-4 h-4 mr-2" />
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}