export interface Enterprise {
  id: string;
  userId: string; // ID del usuario propietario
  name: string;
  rut: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ModuleType = 'dgi' | 'items' | 'digital' | 'exchange';

export interface Module {
  id: ModuleType;
  name: string;
  description: string;
  icon: any;
}