// frontend/src/chat/application/SendMessageUseCase.ts
import { ChatRepository } from '../domain/repositories/ChatRepository';
import { Message } from '../domain/entities/Message';

export class SendMessageUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(toUserId: string, body: string): Promise<Message> {
    if (!toUserId) {
      throw new Error('Recipient ID is required');
    }

    if (!body || !body.trim()) {
      throw new Error('Message body is required');
    }

    return this.chatRepository.sendMessage(toUserId, body.trim());
  }
}
