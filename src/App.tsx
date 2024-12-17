import { useAuthStore } from '@/lib/store/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AdminPanel } from '@/components/auth/AdminPanel';
import { UserDashboard } from '@/components/user/UserDashboard';
import { EnterpriseDashboard } from '@/components/enterprise/EnterpriseDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnterpriseStore } from '@/lib/store/enterprise';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const user = useAuthStore(state => state.user);
  const selectedEnterprise = useEnterpriseStore(state => state.selectedEnterprise);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-teal-800 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Cuenta<span className="text-[#0f172a] text-[1.05em] font-black tracking-tight">T</span>
            </h1>
            <p className="text-white/80">
              Inicia sesión o regístrate para continuar
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-2 mb-8 relative">
                <TabsTrigger 
                  value="login" 
                  className="text-white data-[state=active]:text-[#0f172a] data-[state=active]:bg-white/10"
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-white data-[state=active]:text-[#0f172a] data-[state=active]:bg-white/10"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <>
        <AdminPanel />
        <Toaster />
      </>
    );
  }

  if (selectedEnterprise) {
    return (
      <>
        <EnterpriseDashboard />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <UserDashboard />
      <Toaster />
    </>
  );
}