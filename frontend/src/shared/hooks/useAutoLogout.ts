// frontend/src/shared/hooks/useAutoLogout.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { container } from '../di/container';
import { useAuthStore, useUsersStore, useChatStore, useUnreadCountStore } from '../state/store';

/**
 * Hook para gerenciar logout automático e manual
 */
export const useAutoLogout = () => {
  const clearAuth = useAuthStore(state => state.clearAuth);
  const setUsers = useUsersStore(state => state.setUsers);
  const setUsersError = useUsersStore(state => state.setError);

  const performLogout = useCallback(async (reason?: string) => {
    try {
      console.log(`Realizando logout: ${reason || 'Manual'}`);

      // Desconectar socket
      container.socketClient.disconnect();
      
      // Remover token do HTTP client
      container.httpClient.setAuthToken(null);
      
      // Limpar tokens do storage
      await container.tokenStorage.clearTokens();

      // Limpar estados
      clearAuth();
      setUsers([]);
      setUsersError(null);
      
      useChatStore.setState({ 
        messages: {}, 
        typingUsers: new Set(), 
        error: null 
      });
      
      useUnreadCountStore.setState({ 
        unreadCounts: {}, 
        totalCount: 0,
        isLoading: false 
      });

      console.log('Logout concluído com sucesso');

      // Mostrar alerta apenas se for logout automático
      if (reason) {
        Alert.alert(
          'Sessão Expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  }, [clearAuth, setUsers, setUsersError]);

  const logout = useCallback(() => {
    performLogout();
  }, [performLogout]);

  const autoLogout = useCallback(() => {
    performLogout('Token expirado');
  }, [performLogout]);

  return {
    logout,
    autoLogout,
  };
};