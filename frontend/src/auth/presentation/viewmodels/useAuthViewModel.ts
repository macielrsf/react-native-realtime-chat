// frontend/src/auth/presentation/viewmodels/useAuthViewModel.ts
import { useCallback } from 'react';
import { useAuthStore } from '../../../shared/state/store';
import { container } from '../../../shared/di/container';

export const useAuthViewModel = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setTokens,
    clearAuth,
    setLoading,
    setError,
  } = useAuthStore();

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await container.loginUseCase.execute(username, password);

        setUser(result.user);
        setTokens(result.token, result.refreshToken);

        await container.tokenStorage.saveToken(result.token);
        await container.tokenStorage.saveRefreshToken(result.refreshToken);

        container.httpClient.setAuthToken(result.token);
        container.socketClient.connect(result.token);

        setLoading(false);
        return true;
      } catch (err: any) {
        setError(err.message || 'Login failed');
        setLoading(false);
        return false;
      }
    },
    [setUser, setTokens, setLoading, setError],
  );

  const logout = useCallback(async () => {
    container.socketClient.disconnect();
    container.httpClient.setAuthToken(null);
    await container.tokenStorage.clearTokens();
    clearAuth();
  }, [clearAuth]);

  const restoreSession = useCallback(async () => {
    try {
      setLoading(true);

      const token = await container.tokenStorage.getToken();
      const refreshToken = await container.tokenStorage.getRefreshToken();

      if (!token) {
        setLoading(false);
        return false;
      }

      // Set token on HTTP client
      container.httpClient.setAuthToken(token);

      // Fetch current user
      const result = await container.getMeUseCase.execute();

      setUser(result.user);
      setTokens(token, refreshToken || '');

      // Connect socket
      container.socketClient.connect(token);

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Failed to restore session:', err);
      // If token is invalid, clear everything
      await container.tokenStorage.clearTokens();
      clearAuth();
      setLoading(false);
      return false;
    }
  }, [setUser, setTokens, setLoading, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    restoreSession,
  };
};
