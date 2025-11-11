// frontend/src/users/presentation/viewmodels/useUsersViewModel.ts
import { useCallback, useEffect } from 'react';
import { useUsersStore } from '../../../shared/state/store';
import { container } from '../../../shared/di/container';

export const useUsersViewModel = () => {
  const {
    users,
    isLoading,
    error,
    setUsers,
    updateUserOnlineStatus,
    setLoading,
    setError,
  } = useUsersStore();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await container.listUsersUseCase.execute();
      setUsers(result);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      setLoading(false);
    }
  }, [setUsers, setLoading, setError]);

  useEffect(() => {
    // Setup socket handlers
    container.socketClient.setHandlers({
      onUserOnline: data => {
        updateUserOnlineStatus(data.userId, true);
      },
      onUserOffline: data => {
        updateUserOnlineStatus(data.userId, false);
      },
    });
  }, [updateUserOnlineStatus]);

  return {
    users,
    isLoading,
    error,
    loadUsers,
    refreshUsers: loadUsers,
  };
};
