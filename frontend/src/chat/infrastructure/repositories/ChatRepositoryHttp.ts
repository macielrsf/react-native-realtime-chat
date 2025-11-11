// frontend/src/chat/infrastructure/repositories/ChatRepositoryHttp.ts
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { Message } from '../../domain/entities/Message';
import { ConversationSummary } from '../../application/GetConversationsUseCase';
import { ChatApi } from '../http/ChatApi';
import { ChatMapper } from '../mappers/ChatMapper';
import { SocketClient } from '../ws/SocketClient';

export class ChatRepositoryHttp implements ChatRepository {
  constructor(
    private readonly chatApi: ChatApi,
    private readonly socketClient: SocketClient,
  ) {}

  async getMessages(
    userId: string,
    limit: number = 50,
    before?: string,
  ): Promise<Message[]> {
    const dtos = await this.chatApi.getMessages(userId, limit, before);
    return ChatMapper.dtoListToDomain(dtos);
  }

  async sendMessage(toUserId: string, body: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Send message timeout'));
        }
      }, 5000);

      const currentHandlers = this.socketClient.handlers;
      const originalOnMessageNew = currentHandlers.onMessageNew;

      this.socketClient.setHandlers({
        ...currentHandlers,
        onMessageNew: data => {
          originalOnMessageNew?.(data);

          if (!resolved && data.message.body === body) {
            resolved = true;
            clearTimeout(timeout);
            resolve(ChatMapper.dtoToDomain(data.message));
          }
        },
        onError: data => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            reject(new Error(data.message));
          }
        },
      });

      this.socketClient.sendMessage(toUserId, body);
    });
  }

  async getConversationsWithLastMessage(): Promise<ConversationSummary[]> {
    return this.chatApi.getConversationsWithLastMessage();
  }
}
