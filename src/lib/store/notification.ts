```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      showNotifications: false,
      setShowNotifications: (show) => set({ showNotifications: show })
    }),
    {
      name: 'notification-storage'
    }
  )
);
```

2. Actualizar el Header para incluir las notificaciones:

<boltAction type="file" filePath="src/components/layout/Header.tsx">
```typescript
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useAuthStore } from '@/lib/store/auth';
import { useNotificationStore } from '@/lib/store/notification';
import { NotificationsPopover } from '@/components/auth/admin/NotificationsPopover';
import { cn } from '@/lib/utils';

interface HeaderProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function Header({ leftContent, rightContent }: HeaderProps) {
  const { handleLogout } = useAuth();
  const { users } = useAuthStore();
  const { showNotifications, setShowNotifications } = useNotificationStore();
  
  const pendingUsers = users.filter(u => u.role === 'pending');

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[65px] flex items-center justify-between">
        <div className="flex-1 flex items-center">
          {leftContent}
        </div>
        <h1 className="text-xl font-bold text-white absolute left-1/2 -translate-x-1/2">
          Cuenta<span className="text-[#0f172a] text-[1.05em] font-black tracking-tight">T</span>
        </h1>
        <div className="flex-1 flex justify-end items-center space-x-4">
          {rightContent}
          {pendingUsers.length > 0 && (
            <NotificationsPopover
              pendingUsers={pendingUsers}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
            />
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
```

3. Actualizar el EnterpriseDashboard para mostrar el botón de retroceso a la izquierda:

<boltAction type="file" filePath="src/components/enterprise/EnterpriseDashboard.tsx">
```typescript
import { useEnterpriseStore } from '@/lib/store/enterprise';
import { useModuleStore } from '@/lib/store/module';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ModulePanel } from '@/components/modules/ModulePanel';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/hooks/use-navigate';

export function EnterpriseDashboard() {
  const selectedEnterprise = useEnterpriseStore(state => state.selectedEnterprise);
  const { navigateToEnterprises } = useNavigate();
  const { activeModuleId, selectModule } = useModuleStore();

  if (!selectedEnterprise) {
    return null;
  }

  const handleBack = () => {
    if (activeModuleId) {
      selectModule(null);
    } else {
      navigateToEnterprises();
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex">
      <Sidebar />
      
      <div className="flex-1 pl-1">
        <Header 
          leftContent={
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {!activeModuleId ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Módulos Disponibles
                </h2>
                <ModulePanel />
              </>
            ) : (
              <ModulePanel />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
```

4. Actualizar el store de módulos para mantener el estado:

<boltAction type="file" filePath="src/lib/store/module.ts">
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleType } from '@/lib/types/module';

interface ModuleState {
  activeModuleId: ModuleType | null;
  selectModule: (id: ModuleType | null) => void;
  clearModule: () => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set) => ({
      activeModuleId: null,
      selectModule: (id) => set({ activeModuleId: id }),
      clearModule: () => set({ activeModuleId: null })
    }),
    {
      name: 'module-storage',
      partialize: (state) => ({ activeModuleId: state.activeModuleId })
    }
  )
);
```

5. Actualizar el hook useAuth para manejar el logout:

<boltAction type="file" filePath="src/lib/hooks/use-auth.ts">
```typescript
import { useCallback } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useModuleStore } from '@/lib/store/module';
import { useEnterpriseStore } from '@/lib/store/enterprise';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const { 
    user,
    login,
    logout: authLogout,
    register,
    isLoading,
    error,
    clearError
  } = useAuthStore();
  
  const clearModule = useModuleStore(state => state.clearModule);
  const clearSelectedEnterprise = useEnterpriseStore(state => state.clearSelectedEnterprise);
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    authLogout();
    clearModule();
    clearSelectedEnterprise();
  }, [authLogout, clearModule, clearSelectedEnterprise]);

  return {
    user,
    isLoading,
    error,
    clearError,
    handleLogin: login,
    handleLogout,
    handleRegister: register
  };
}
```

</boltArtifact>

Estos cambios:

1. Centralizan el logo CuentaT en todos los encabezados
2. Mueven el botón de retroceso a la izquierda
3. Añaden las notificaciones para usuarios pendientes
4. Corrigen el funcionamiento del logout
5. Mejoran la navegación entre módulos
6. Mantienen el estado de los módulos al navegar

Los usuarios ahora verán:
- El logo CuentaT centrado en todas las páginas
- El botón de retroceso a la izquierda
- Las notificaciones de usuarios pendientes junto al botón de salir
- Una navegación más intuitiva entre módulos
- Un mejor manejo del estado de