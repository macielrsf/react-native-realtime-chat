import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../shared/di/container';
import { ConversationSummary } from '../../application/GetConversationsUseCase';

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await container.getConversationsUseCase.execute();
      setConversations(result);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load conversations',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationLastMessage = useCallback(
    (data: {
      userId: string;
      lastMessage: {
        id: string;
        body: string;
        createdAt: string;
        isFromCurrentUser: boolean;
      };
    }) => {
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conversation => {
          if (conversation.conversationWith.id === data.userId) {
            return {
              ...conversation,
              lastMessage: {
                id: data.lastMessage.id,
                body: data.lastMessage.body,
                createdAt: data.lastMessage.createdAt,
                isFromMe: data.lastMessage.isFromCurrentUser,
              },
            };
          }
          return conversation;
        });

        // Sort by last message date (most recent first)
        return updatedConversations.sort((a, b) => {
          const aDate = new Date(a.lastMessage?.createdAt || 0).getTime();
          const bDate = new Date(b.lastMessage?.createdAt || 0).getTime();
          return bDate - aDate;
        });
      });
    },
    [],
  );

  useEffect(() => {
    loadConversations();
  }, []);

  // Setup WebSocket listeners for conversation updates
  useEffect(() => {
    const handleConversationUpdated = (data: {
      userId: string;
      lastMessage: {
        id: string;
        body: string;
        createdAt: string;
        isFromCurrentUser: boolean;
      };
    }) => {
      updateConversationLastMessage(data);
    };

    // Get current handlers and merge with new ones
    const socketClient = container.socketClient as any;
    const previousHandlers = socketClient.handlers || {};

    container.socketClient.setHandlers({
      ...previousHandlers,
      onConversationUpdated: handleConversationUpdated,
    });

    // Cleanup on unmount
    return () => {
      // Remove only our handler, restore previous ones
      container.socketClient.setHandlers(previousHandlers);
    };
  }, [updateConversationLastMessage]);

  const refreshConversations = () => {
    loadConversations();
  };

  return {
    conversations,
    isLoading,
    error,
    refreshConversations,
  };
};
