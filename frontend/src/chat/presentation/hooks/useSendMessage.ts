// frontend/src/chat/presentation/hooks/useSendMessage.ts
import { useState, useCallback } from 'react';
import { container } from '../../../shared/di/container';
import { Message } from '../../domain/entities/Message';

export interface PendingMessage {
  tempId: string;
  toUserId: string;
  body: string;
  timestamp: number;
  status: 'sending' | 'failed';
  error?: string;
}

export const useSendMessage = (currentUserId: string, otherUserId: string) => {
  const [pendingMessages, setPendingMessages] = useState<
    Map<string, PendingMessage>
  >(new Map());

  const sendMessage = useCallback(
    async (body: string): Promise<Message | null> => {
      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Add to pending
      setPendingMessages(prev =>
        new Map(prev).set(tempId, {
          tempId,
          toUserId: otherUserId,
          body,
          timestamp: Date.now(),
          status: 'sending',
        }),
      );

      try {
        // Try to send
        const sentMessage = await container.sendMessageUseCase.execute(
          otherUserId,
          body,
        );

        // Success - remove from pending
        setPendingMessages(prev => {
          const next = new Map(prev);
          next.delete(tempId);
          return next;
        });

        return sentMessage;
      } catch (err: any) {
        console.error('Failed to send message:', err);

        // Extract error message safely
        const errorMessage =
          err?.message || err?.toString() || 'Failed to send message';

        // Mark as failed
        setPendingMessages(prev => {
          const next = new Map(prev);
          const pending = next.get(tempId);
          if (pending) {
            next.set(tempId, {
              ...pending,
              status: 'failed',
              error: errorMessage,
            });
          }
          return next;
        });

        return null;
      }
    },
    [otherUserId],
  );

  const retryMessage = useCallback(
    async (tempId: string): Promise<Message | null> => {
      const pending = pendingMessages.get(tempId);
      if (!pending || pending.status !== 'failed') {
        return null;
      }

      // Update status to sending
      setPendingMessages(prev => {
        const next = new Map(prev);
        next.set(tempId, { ...pending, status: 'sending' });
        return next;
      });

      try {
        const sentMessage = await container.sendMessageUseCase.execute(
          pending.toUserId,
          pending.body,
        );

        // Success - remove from pending
        setPendingMessages(prev => {
          const next = new Map(prev);
          next.delete(tempId);
          return next;
        });

        return sentMessage;
      } catch (err: any) {
        console.error('Failed to retry message:', err);

        // Extract error message safely
        const errorMessage =
          err?.message || err?.toString() || 'Failed to retry message';

        // Mark as failed again
        setPendingMessages(prev => {
          const next = new Map(prev);
          next.set(tempId, {
            ...pending,
            status: 'failed',
            error: errorMessage,
          });
          return next;
        });

        return null;
      }
    },
    [pendingMessages],
  );

  const getPendingMessagesList = useCallback(() => {
    return Array.from(pendingMessages.values());
  }, [pendingMessages]);

  const clearPendingMessage = useCallback((tempId: string) => {
    setPendingMessages(prev => {
      const next = new Map(prev);
      next.delete(tempId);
      return next;
    });
  }, []);

  // Convert pending messages to Message objects for display
  const getPendingMessagesAsMessages = useCallback((): Message[] => {
    return Array.from(pendingMessages.values()).map(pending =>
      Message.create({
        id: pending.tempId,
        from: currentUserId,
        to: pending.toUserId,
        body: pending.body,
        delivered: false,
        createdAt: new Date(pending.timestamp).toISOString(),
        status: pending.status,
      }),
    );
  }, [pendingMessages, currentUserId]);

  return {
    sendMessage,
    retryMessage,
    pendingMessages: getPendingMessagesList(),
    pendingMessagesAsMessages: getPendingMessagesAsMessages(),
    clearPendingMessage,
  };
};
