import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Enterprise } from '@/lib/types/enterprise';
import { useAuthStore } from './auth';

interface EnterpriseState {
  enterprises: Enterprise[];
  selectedEnterprise: Enterprise | null;
  addEnterprise: (name: string, rut: string, logo?: string) => Enterprise;
  selectEnterprise: (id: string) => void;
  clearSelectedEnterprise: () => void;
  getUserEnterprises: () => Enterprise[];
}

const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB límite para localStorage

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set, get) => ({
      enterprises: [],
      selectedEnterprise: null,

      addEnterprise: (name, rut, logo) => {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('Usuario no autenticado');

        // Validar tamaño del logo
        if (logo && logo.length > MAX_STORAGE_SIZE) {
          throw new Error('El logo es demasiado grande. Máximo 4.5MB.');
        }

        const newEnterprise: Enterprise = {
          id: crypto.randomUUID(),
          userId: user.id,
          name,
          rut,
          logo,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Verificar espacio disponible
        const currentState = JSON.stringify(get().enterprises);
        const newState = JSON.stringify([...get().enterprises, newEnterprise]);
        
        if (newState.length > MAX_STORAGE_SIZE) {
          throw new Error('No hay suficiente espacio. Por favor, elimine algunas empresas o reduzca el tamaño del logo.');
        }

        set(state => ({
          enterprises: [...state.enterprises, newEnterprise]
        }));

        return newEnterprise;
      },

      selectEnterprise: (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const enterprise = get().enterprises.find(e => 
          e.id === id && e.userId === user.id
        );

        set({ selectedEnterprise: enterprise || null });
      },

      clearSelectedEnterprise: () => set({ selectedEnterprise: null }),

      getUserEnterprises: () => {
        const user = useAuthStore.getState().user;
        if (!user) return [];

        return get().enterprises.filter(e => e.userId === user.id);
      }
    }),
    {
      name: 'enterprise-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        enterprises: state.enterprises.map(enterprise => ({
          ...enterprise,
          createdAt: enterprise.createdAt.toISOString(),
          updatedAt: enterprise.updatedAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.enterprises = state.enterprises.map(enterprise => ({
            ...enterprise,
            createdAt: new Date(enterprise.createdAt),
            updatedAt: new Date(enterprise.updatedAt)
          }));
          state.selectedEnterprise = null;
        }
      }
    }
  )
);