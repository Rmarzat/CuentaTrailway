import { useState } from 'react';
import { useModuleStore } from '@/lib/store/module';
import { cn } from '@/lib/utils';
import { FileSpreadsheet, FileText, Database, DollarSign } from 'lucide-react';
import { UserProfile } from '@/components/auth/UserProfile';
import { useEnterpriseStore } from '@/lib/store/enterprise';
import type { ModuleType } from '@/lib/types/module';

const modules = [
  {
    id: 'dgi',
    name: 'Asientos DGI',
    icon: FileSpreadsheet
  },
  {
    id: 'items',
    name: 'Asientos por Items',
    icon: FileText
  },
  {
    id: 'digital',
    name: 'Archivo Digital',
    icon: Database
  },
  {
    id: 'exchange',
    name: 'Tipo de Cambio',
    icon: DollarSign
  }
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeModuleId, selectModule } = useModuleStore();
  const selectedEnterprise = useEnterpriseStore(state => state.selectedEnterprise);

  return (
    <div 
      className="fixed left-0 top-0 h-full z-50 w-1"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={cn(
        "h-full bg-[#1e293b]/70 backdrop-blur-sm transition-all duration-200 absolute top-0",
        "flex flex-col border-r border-white/5",
        isExpanded ? "left-0 w-64" : "-translate-x-full w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-[65px] px-4 flex items-center border-b border-white/5">
            <div className="w-full truncate">
              <h2 className="text-base font-medium text-white/70 truncate">
                {selectedEnterprise?.name}
              </h2>
              <p className="text-xs text-white/40 truncate">
                RUT: {selectedEnterprise?.rut}
              </p>
            </div>
          </div>

          <div className="flex-1 p-2">
            <nav className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => selectModule(module.id as ModuleType)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm rounded-lg",
                      "transition-colors duration-150",
                      "text-left",
                      activeModuleId === module.id 
                        ? "text-white bg-white/10" 
                        : "text-white hover:bg-white/[0.02]"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3 shrink-0" />
                    <span className="truncate">{module.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-white/5">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}