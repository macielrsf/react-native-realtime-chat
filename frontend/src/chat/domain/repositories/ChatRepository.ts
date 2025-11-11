// frontend/src/chat/domain/repositories/ChatRepository.ts
import { Message } from '../entities/Message';
import { ConversationSummary } from '../../application/GetConversationsUseCase';

export interface ChatRepository {
  getMessages(
    userId: string,
    limit?: number,
    before?: string,
  ): Promise<Message[]>;

  sendMessage(toUserId: string, body: string): Promise<Message>;

  getConversationsWithLastMessage(): Promise<ConversationSummary[]>;
}
