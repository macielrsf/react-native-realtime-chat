// frontend/src/core/presentation/navigation/AuthProvider.tsx
import React, { useEffect } from 'react';
import { useAuthViewModel } from '../../../auth/presentation/viewmodels/useAuthViewModel';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider garante que restoreSession() execute antes da navegação
 * Isso permite auto-login ao abrir o app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { restoreSession } = useAuthViewModel();

  useEffect(() => {
    // Executa restoreSession ao montar
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
};
