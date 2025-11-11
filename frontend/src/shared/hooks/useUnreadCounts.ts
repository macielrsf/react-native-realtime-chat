// frontend/src/shared/hooks/useUnreadCounts.ts
import { useEffect, useCallback } from 'react';
import { useUnreadCountStore } from '../state/store';
import { container } from '../di/container';

export const useUnreadCounts = () => {
  const {
    unreadCounts,
    totalCount,
    isLoading,
    setUnreadCounts,
    updateUnreadCount,
    incrementUnreadCount,
    markAsRead,
    setLoading,
  } = useUnreadCountStore();

  // Buscar contagens iniciais
  const loadUnreadCounts = useCallback(async () => {
    try {
      setLoading(true);
      const counts = await container.getUnreadCountsUseCase.execute();
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Failed to load unread counts:', error);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCounts, setLoading]);

  // Marcar como lida
  const markConversationAsRead = useCallback(
    async (userId: string) => {
      try {
        await container.markAsReadUseCase.execute(userId);
        markAsRead(userId);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    },
    [markAsRead],
  );

  // Configurar listeners do WebSocket
  useEffect(() => {
    const handleUnreadCountsUpdated = (data: {
      unreadCounts: Array<{ conversationWith: string; count: number }>;
    }) => {
      setUnreadCounts(data.unreadCounts);
    };

    // Obter cliente socket e configurar handlers
    const socketClient = container.socketClient as any;
    const previousHandlers = socketClient.handlers || {};

    container.socketClient.setHandlers({
      ...previousHandlers,
      onUnreadCountsUpdated: handleUnreadCountsUpdated,
    });

    // Carregar contagens iniciais
    loadUnreadCounts();

    // Cleanup
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onUnreadCountsUpdated, ...restHandlers } = previousHandlers;
      container.socketClient.setHandlers(restHandlers);
    };
  }, [loadUnreadCounts, setUnreadCounts]);

  return {
    unreadCounts,
    totalCount,
    isLoading,
    loadUnreadCounts,
    markConversationAsRead,
    incrementUnreadCount,
    updateUnreadCount,
  };
};
