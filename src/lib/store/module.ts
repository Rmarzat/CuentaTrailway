import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleType } from '@/lib/types/module';

interface ModuleState {
  activeModuleId: ModuleType | null;
  selectModule: (id: ModuleType | null) => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set) => ({
      activeModuleId: null,
      selectModule: (id) => set({ activeModuleId: id })
    }),
    {
      name: 'module-storage',
      partialize: (state) => ({ activeModuleId: state.activeModuleId })
    }
  )
);