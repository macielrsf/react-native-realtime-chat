// frontend/src/chat/application/GetConversationsUseCase.ts
import { ChatRepository } from '../domain/repositories/ChatRepository';

export interface ConversationSummary {
  conversationWith: {
    id: string;
    name: string;
    username: string;
  };
  lastMessage: {
    id: string;
    body: string;
    createdAt: string;
    isFromMe: boolean;
  };
}

export class GetConversationsUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(): Promise<ConversationSummary[]> {
    return this.chatRepository.getConversationsWithLastMessage();
  }
}
