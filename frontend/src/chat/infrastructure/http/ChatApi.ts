// frontend/src/chat/infrastructure/http/ChatApi.ts
import { HttpClient } from '../../../shared/http/HttpClient';

export interface MessageDto {
  id: string;
  from: string;
  to: string;
  body: string;
  delivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface ConversationDto {
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

export class ChatApi {
  constructor(private readonly httpClient: HttpClient) {}

  async getMessages(
    userId: string,
    limit: number = 50,
    before?: string,
  ): Promise<MessageDto[]> {
    const params: any = { limit };
    if (before) {
      params.before = before;
    }

    return this.httpClient.get<MessageDto[]>(`/api/chat/${userId}/messages`, {
      params,
    });
  }

  async getConversationsWithLastMessage(): Promise<ConversationDto[]> {
    return this.httpClient.get<ConversationDto[]>('/api/chat/conversations');
  }
}
