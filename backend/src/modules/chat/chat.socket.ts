// backend/src/modules/chat/chat.socket.ts
import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../../utils/jwt";
import { ChatService } from "./chat.service";
import { logger } from "../../config/logger";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class ChatSocketHandler {
  private chatService: ChatService;
  private onlineUsers: Set<string>;
  private userSocketMap: Map<string, string>;
  private typingUsers: Map<string, Set<string>>;

  constructor(private io: Server, onlineUsers: Set<string>) {
    this.chatService = new ChatService();
    this.onlineUsers = onlineUsers;
    this.userSocketMap = new Map();
    this.typingUsers = new Map();
  }

  public handleConnection(socket: AuthenticatedSocket): void {
    logger.info(`Socket attempting connection: ${socket.id}`);

    // Authenticate socket
    const token = socket.handshake.auth.token;

    if (!token) {
      logger.warn(`Socket ${socket.id} disconnected: no token`);
      socket.disconnect();
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      socket.userId = payload.userId;

      this.userSocketMap.set(payload.userId, socket.id);
      this.onlineUsers.add(payload.userId);

      logger.info(`User ${payload.userId} connected via socket ${socket.id}`);

      // Broadcast user online status
      socket.broadcast.emit("user:online", { userId: payload.userId });

      // Send initial unread counts to user
      this.sendInitialUnreadCounts(socket);

      // Listen to events
      this.setupEventListeners(socket);

      // Handle disconnection
      socket.on("disconnect", () => {
        this.handleDisconnection(socket);
      });
    } catch (error) {
      logger.error(`Socket authentication failed: ${error}`);
      socket.disconnect();
    }
  }

  private setupEventListeners(socket: AuthenticatedSocket): void {
    socket.on(
      "message:send",
      async (data: { toUserId: string; body: string }) => {
        await this.handleMessageSend(socket, data);
      }
    );

    socket.on("typing:start", (data: { toUserId: string }) => {
      this.handleTypingStart(socket, data);
    });

    socket.on("typing:stop", (data: { toUserId: string }) => {
      this.handleTypingStop(socket, data);
    });

    socket.on(
      "messages:markAsRead",
      async (data: { conversationWith: string }) => {
        await this.handleMarkAsRead(socket, data);
      }
    );
  }

  private async handleMessageSend(
    socket: AuthenticatedSocket,
    data: { toUserId: string; body: string }
  ): Promise<void> {
    try {
      if (!socket.userId) return;

      const { toUserId, body } = data;

      if (!body || !body.trim()) {
        socket.emit("error", { message: "Message body is required" });
        return;
      }

      const message = await this.chatService.createMessage(
        socket.userId,
        toUserId,
        body.trim()
      );

      // Send to recipient if online
      const recipientSocketId = this.userSocketMap.get(toUserId);

      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("message:new", { message });

        // Send updated unread count to recipient
        const unreadCounts = await this.chatService.getUserUnreadCounts(
          toUserId
        );
        this.io
          .to(recipientSocketId)
          .emit("unreadCounts:updated", { unreadCounts });

        // Mark as delivered
        await this.chatService.markAsDelivered(message.id);

        // Notify sender about delivery
        socket.emit("message:delivered", {
          messageId: message.id,
          timestamp: new Date().toISOString(),
        });
      }

      // Send confirmation to sender
      socket.emit("message:new", { message });

      logger.info(`Message sent from ${socket.userId} to ${toUserId}`);
    } catch (error) {
      logger.error(`Error sending message: ${error}`);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private async handleMarkAsRead(
    socket: AuthenticatedSocket,
    data: { conversationWith: string }
  ): Promise<void> {
    try {
      if (!socket.userId) return;

      const { conversationWith } = data;

      await this.chatService.markMessagesAsRead(
        socket.userId,
        conversationWith
      );

      // Send updated unread counts back to user
      const unreadCounts = await this.chatService.getUserUnreadCounts(
        socket.userId
      );
      socket.emit("unreadCounts:updated", { unreadCounts });

      logger.info(
        `User ${socket.userId} marked messages as read with ${conversationWith}`
      );
    } catch (error) {
      logger.error(`Error marking messages as read: ${error}`);
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  }

  private async sendInitialUnreadCounts(
    socket: AuthenticatedSocket
  ): Promise<void> {
    try {
      if (!socket.userId) return;

      const unreadCounts = await this.chatService.getUserUnreadCounts(
        socket.userId
      );
      socket.emit("unreadCounts:updated", { unreadCounts });

      logger.info(`Sent initial unread counts to user ${socket.userId}`);
    } catch (error) {
      logger.error(`Error sending initial unread counts: ${error}`);
    }
  }

  private handleTypingStart(
    socket: AuthenticatedSocket,
    data: { toUserId: string }
  ): void {
    if (!socket.userId) return;

    const { toUserId } = data;

    if (!this.typingUsers.has(toUserId)) {
      this.typingUsers.set(toUserId, new Set());
    }

    this.typingUsers.get(toUserId)!.add(socket.userId);

    const recipientSocketId = this.userSocketMap.get(toUserId);

    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit("typing:start", {
        userId: socket.userId,
      });
    }
  }

  private handleTypingStop(
    socket: AuthenticatedSocket,
    data: { toUserId: string }
  ): void {
    if (!socket.userId) return;

    const { toUserId } = data;

    const typingSet = this.typingUsers.get(toUserId);

    if (typingSet) {
      typingSet.delete(socket.userId);

      if (typingSet.size === 0) {
        this.typingUsers.delete(toUserId);
      }
    }

    const recipientSocketId = this.userSocketMap.get(toUserId);

    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit("typing:stop", {
        userId: socket.userId,
      });
    }
  }

  private handleDisconnection(socket: AuthenticatedSocket): void {
    if (!socket.userId) return;

    logger.info(`User ${socket.userId} disconnected from socket ${socket.id}`);

    this.onlineUsers.delete(socket.userId);
    this.userSocketMap.delete(socket.userId);

    // Clean up typing indicators
    this.typingUsers.forEach((typingSet, toUserId) => {
      if (typingSet.has(socket.userId!)) {
        typingSet.delete(socket.userId!);

        if (typingSet.size === 0) {
          this.typingUsers.delete(toUserId);
        }

        const recipientSocketId = this.userSocketMap.get(toUserId);

        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit("typing:stop", {
            userId: socket.userId,
          });
        }
      }
    });

    // Broadcast user offline status
    socket.broadcast.emit("user:offline", { userId: socket.userId });
  }
}
