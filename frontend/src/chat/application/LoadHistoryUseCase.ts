// frontend/src/chat/application/LoadHistoryUseCase.ts
import { ChatRepository } from '../domain/repositories/ChatRepository';
import { Message } from '../domain/entities/Message';

export class LoadHistoryUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(
    userId: string,
    limit: number = 50,
    before?: string,
  ): Promise<Message[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.chatRepository.getMessages(userId, limit, before);
  }
}
