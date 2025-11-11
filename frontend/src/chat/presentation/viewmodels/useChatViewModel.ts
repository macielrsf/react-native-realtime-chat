// frontend/src/chat/presentation/viewmodels/useChatViewModel.ts
import { useCallback, useEffect } from 'react';
import { useChatStore } from '../../../shared/state/store';
import { useAuthStore } from '../../../shared/state/store';
import { container } from '../../../shared/di/container';

export const useChatViewModel = (otherUserId: string) => {
  const { user: currentUser } = useAuthStore();
  const {
    messages,
    typingUsers,
    isLoading,
    error,
    setMessages,
    addMessage,
    setTyping,
    setLoading,
    setError,
  } = useChatStore();

  const chatMessages = messages[otherUserId] || [];
  const isTyping = typingUsers.has(otherUserId);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await container.loadHistoryUseCase.execute(otherUserId);
      setMessages(otherUserId, result);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      setLoading(false);
    }
  }, [otherUserId, setMessages, setLoading, setError]);

  const sendMessage = useCallback(
    async (body: string) => {
      try {
        // Envia mensagem - não adiciona localmente porque o servidor retornará via socket
        await container.sendMessageUseCase.execute(otherUserId, body);
      } catch (err: any) {
        setError(err.message || 'Failed to send message');
        throw err;
      }
    },
    [otherUserId, setError],
  );

  const startTyping = useCallback(() => {
    container.socketClient.startTyping(otherUserId);
  }, [otherUserId]);

  const stopTyping = useCallback(() => {
    container.socketClient.stopTyping(otherUserId);
  }, [otherUserId]);

  useEffect(() => {
    // Setup socket handlers for this chat
    const handleMessageNew = (data: any) => {
      const message = data.message;
      if (message.from === otherUserId || message.to === otherUserId) {
        addMessage(otherUserId, {
          id: message.id,
          from: message.from,
          to: message.to,
          body: message.body,
          delivered: message.delivered,
          deliveredAt: message.deliveredAt
            ? new Date(message.deliveredAt)
            : null,
          createdAt: new Date(message.createdAt),
          isFromMe: (userId: string) => message.from === userId,
        } as any);
      }
    };

    const handleTypingStart = (data: any) => {
      if (data.userId === otherUserId) {
        setTyping(otherUserId, true);
      }
    };

    const handleTypingStop = (data: any) => {
      if (data.userId === otherUserId) {
        setTyping(otherUserId, false);
      }
    };

    // Get current handlers and merge with new ones
    const socketClient = container.socketClient as any;
    const previousHandlers = socketClient.handlers || {};

    container.socketClient.setHandlers({
      ...previousHandlers,
      onMessageNew: handleMessageNew,
      onTypingStart: handleTypingStart,
      onTypingStop: handleTypingStop,
    });

    // Cleanup on unmount
    return () => {
      // Remove only our handlers, restore previous ones
      container.socketClient.setHandlers({
        ...previousHandlers,
        onMessageNew: previousHandlers.onMessageNew,
        onTypingStart: previousHandlers.onTypingStart,
        onTypingStop: previousHandlers.onTypingStop,
      });
    };
  }, [otherUserId, addMessage, setTyping]);

  return {
    messages: chatMessages,
    isTyping,
    isLoading,
    error,
    currentUserId: currentUser?.id || '',
    loadHistory,
    sendMessage,
    startTyping,
    stopTyping,
  };
};
