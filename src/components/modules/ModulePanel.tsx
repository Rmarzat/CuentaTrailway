import { useModuleStore } from '@/lib/store/module';
import { DGIModule } from './DGIModule';
import { ItemsModule } from './ItemsModule';
import { DigitalModule } from './DigitalModule';
import { ExchangeRateModule } from './ExchangeRateModule';
import { FileSpreadsheet, FileText, Database, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ModuleType } from '@/lib/types/module';

const modules = [
  {
    id: 'dgi',
    name: 'Asientos DGI',
    description: 'Procesar asientos desde archivos DGI',
    icon: FileSpreadsheet,
    component: DGIModule
  },
  {
    id: 'items',
    name: 'Asientos por Items',
    description: 'Gestionar asientos por items específicos',
    icon: FileText,
    component: ItemsModule
  },
  {
    id: 'digital',
    name: 'Archivo Digital',
    description: 'Almacenamiento y procesamiento digital',
    icon: Database,
    component: DigitalModule
  },
  {
    id: 'exchange',
    name: 'Tipo de Cambio',
    description: 'Gestionar tipos de cambio históricos',
    icon: DollarSign,
    component: ExchangeRateModule
  }
];

export function ModulePanel() {
  const { activeModuleId, selectModule } = useModuleStore();

  // Si hay un módulo activo, mostrar su componente
  if (activeModuleId) {
    const module = modules.find(m => m.id === activeModuleId);
    if (!module?.component) return null;
    
    const ModuleComponent = module.component;
    return <ModuleComponent />;
  }

  // Si no hay módulo activo, mostrar la grilla de módulos
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => {
        const Icon = module.icon;
        return (
          <Card
            key={module.id}
            className="p-6 cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
            onClick={() => selectModule(module.id as ModuleType)}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-white/10">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  {module.name}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  {module.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}