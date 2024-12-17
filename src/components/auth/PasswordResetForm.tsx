import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export function PasswordResetForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const requestPasswordReset = useAuthStore(state => state.requestPasswordReset);
  const updatePassword = useAuthStore(state => state.updatePassword);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resetCode = requestPasswordReset(email);
      setSuccess(`Código de recuperación: ${resetCode}`);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar recuperación');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updatePassword(email, code, newPassword);
      setSuccess('Contraseña actualizada correctamente');
      setStep(1);
      setEmail('');
      setCode('');
      setNewPassword('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar contraseña');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-sm text-emerald-500 bg-emerald-100/10 rounded-md">
          {success}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <Input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <KeyRound className="w-4 h-4 mr-2" />
            Solicitar Recuperación
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
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3 flex items-center justify-center bg-transparent text-white/40 hover:text-white/60 transition-colors outline-none"
            >
              {showPassword ? 
                <EyeOff className="w-4 h-4" /> : 
                <Eye className="w-4 h-4" />
              }
            </button>
          </div>
          <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white">
            <KeyRound className="w-4 h-4 mr-2" />
            Actualizar Contraseña
          </Button>
        </form>
      )}
    </div>
  );
}