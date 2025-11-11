// backend/src/modules/chat/chat.service.ts
import { MessageModel, IMessage } from "./message.model";
import { UnreadCountService } from "./unreadCount.service";
import mongoose from "mongoose";

export interface MessageDto {
  id: string;
  from: string;
  to: string;
  body: string;
  delivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export class ChatService {
  private unreadCountService = new UnreadCountService();

  async getMessages(
    userId: string,
    otherUserId: string,
    limit: number = 50,
    before?: string
  ): Promise<MessageDto[]> {
    const query: any = {
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("from", "name username")
      .populate("to", "name username");

    return messages.reverse().map((msg) => this.mapMessageToDto(msg));
  }

  async createMessage(
    fromUserId: string,
    toUserId: string,
    body: string
  ): Promise<MessageDto> {
    const message = await MessageModel.create({
      from: new mongoose.Types.ObjectId(fromUserId),
      to: new mongoose.Types.ObjectId(toUserId),
      body,
      delivered: false,
    });

    await message.populate("from", "name username");
    await message.populate("to", "name username");

    // Incrementa a contagem de mensagens não lidas para o destinatário
    await this.unreadCountService.incrementUnreadCount(toUserId, fromUserId);

    return this.mapMessageToDto(message);
  }

  async markAsDelivered(messageId: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId, {
      delivered: true,
      deliveredAt: new Date(),
    });
  }

  /**
   * Marca mensagens como lidas e limpa a contagem de não lidas
   */
  async markMessagesAsRead(
    userId: string,
    conversationWith: string
  ): Promise<boolean> {
    return await this.unreadCountService.markAsRead(userId, conversationWith);
  }

  /**
   * Busca contagens de mensagens não lidas para um usuário
   */
  async getUserUnreadCounts(userId: string) {
    return await this.unreadCountService.getUserUnreadCounts(userId);
  }

  /**
   * Busca total de mensagens não lidas para um usuário
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    return await this.unreadCountService.getTotalUnreadCount(userId);
  }

  private mapMessageToDto(message: IMessage): MessageDto {
    return {
      id: message._id.toString(),
      from: (message.from as any)._id?.toString() || message.from.toString(),
      to: (message.to as any)._id?.toString() || message.to.toString(),
      body: message.body,
      delivered: message.delivered,
      deliveredAt: message.deliveredAt?.toISOString(),
      createdAt: message.createdAt.toISOString(),
    };
  }
}
