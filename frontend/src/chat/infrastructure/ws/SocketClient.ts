// frontend/src/chat/infrastructure/ws/SocketClient.ts
import io, { Socket } from 'socket.io-client';
import { env } from '../../../shared/config/env';
import { MessageDto } from '../http/ChatApi';

export type SocketEventHandler = {
  onMessageNew?: (data: { message: MessageDto }) => void;
  onMessageDelivered?: (data: { messageId: string; timestamp: string }) => void;
  onUserOnline?: (data: { userId: string }) => void;
  onUserOffline?: (data: { userId: string }) => void;
  onTypingStart?: (data: { userId: string }) => void;
  onTypingStop?: (data: { userId: string }) => void;
  onUnreadCountsUpdated?: (data: {
    unreadCounts: Array<{ conversationWith: string; count: number }>;
  }) => void;
  onConversationUpdated?: (data: {
    userId: string;
    lastMessage: {
      id: string;
      body: string;
      createdAt: string;
      isFromCurrentUser: boolean;
    };
  }) => void;
  onError?: (data: { message: string }) => void;
};

export class SocketClient {
  private socket: Socket | null = null;
  private handlers: SocketEventHandler = {};

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(env.wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(toUserId: string, body: string): void {
    this.socket?.emit('message:send', { toUserId, body });
  }

  startTyping(toUserId: string): void {
    this.socket?.emit('typing:start', { toUserId });
  }

  stopTyping(toUserId: string): void {
    this.socket?.emit('typing:stop', { toUserId });
  }

  setHandlers(handlers: SocketEventHandler): void {
    this.handlers = handlers;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('message:new', data => {
      this.handlers.onMessageNew?.(data);
    });

    this.socket.on('message:delivered', data => {
      this.handlers.onMessageDelivered?.(data);
    });

    this.socket.on('user:online', data => {
      this.handlers.onUserOnline?.(data);
    });

    this.socket.on('user:offline', data => {
      this.handlers.onUserOffline?.(data);
    });

    this.socket.on('typing:start', data => {
      this.handlers.onTypingStart?.(data);
    });

    this.socket.on('typing:stop', data => {
      this.handlers.onTypingStop?.(data);
    });

    this.socket.on('unreadCounts:updated', data => {
      this.handlers.onUnreadCountsUpdated?.(data);
    });

    this.socket.on('conversation:updated', data => {
      this.handlers.onConversationUpdated?.(data);
    });

    this.socket.on('error', data => {
      this.handlers.onError?.(data);
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
}
