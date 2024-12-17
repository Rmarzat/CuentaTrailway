export type ModuleType = 'dgi' | 'items' | 'digital' | 'exchange';

export interface Module {
  id: ModuleType;
  name: string;
  description: string;
  icon: any;
  component?: React.ComponentType;
}

export interface ModuleState {
  activeModuleId: ModuleType | null;
  selectModule: (id: ModuleType | null) => void;
}