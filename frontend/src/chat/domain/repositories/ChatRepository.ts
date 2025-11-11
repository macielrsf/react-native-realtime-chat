// frontend/src/chat/domain/repositories/ChatRepository.ts
import { Message } from '../entities/Message';

export interface ChatRepository {
  getMessages(
    userId: string,
    limit?: number,
    before?: string,
  ): Promise<Message[]>;

  sendMessage(toUserId: string, body: string): Promise<Message>;
}
