import { useCallback } from 'react';
import { useEnterpriseStore } from '@/lib/store/enterprise';

export function useNavigate() {
  const selectEnterprise = useEnterpriseStore(state => state.selectEnterprise);
  const clearSelectedEnterprise = useEnterpriseStore(state => state.clearSelectedEnterprise);

  const navigateToEnterprise = useCallback((id: string) => {
    selectEnterprise(id);
  }, [selectEnterprise]);

  const navigateToEnterprises = useCallback(() => {
    clearSelectedEnterprise();
  }, [clearSelectedEnterprise]);

  return {
    navigateToEnterprise,
    navigateToEnterprises
  };
}