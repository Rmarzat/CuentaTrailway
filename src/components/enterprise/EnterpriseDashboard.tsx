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
          rightContent={
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