// frontend/__tests__/unit/SendMessageUseCase.test.ts
import { SendMessageUseCase } from '../../src/chat/application/SendMessageUseCase';
import { ChatRepository } from '../../src/chat/domain/repositories/ChatRepository';
import { Message } from '../../src/chat/domain/entities/Message';
import { ConversationSummary } from '../../src/chat/application/GetConversationsUseCase';

class MockChatRepository implements ChatRepository {
  async sendMessage(toUserId: string, body: string): Promise<Message> {
    return Message.create({
      id: 'msg-1',
      from: 'user-1',
      to: toUserId,
      body,
      delivered: false,
      createdAt: new Date().toISOString(),
    });
  }

  async getMessages(): Promise<Message[]> {
    throw new Error('Not implemented');
  }

  async getConversationsWithLastMessage(): Promise<ConversationSummary[]> {
    return [];
  }
}

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let repository: MockChatRepository;

  beforeEach(() => {
    repository = new MockChatRepository();
    useCase = new SendMessageUseCase(repository);
  });

  it('should send message successfully', async () => {
    const message = await useCase.execute('user-2', 'Hello World');

    expect(message).toBeDefined();
    expect(message.to).toBe('user-2');
    expect(message.body).toBe('Hello World');
  });

  it('should trim message body', async () => {
    const message = await useCase.execute('user-2', '  Hello World  ');

    expect(message.body).toBe('Hello World');
  });

  it('should throw error when recipient ID is empty', async () => {
    await expect(useCase.execute('', 'Hello')).rejects.toThrow(
      'Recipient ID is required',
    );
  });

  it('should throw error when message body is empty', async () => {
    await expect(useCase.execute('user-2', '')).rejects.toThrow(
      'Message body is required',
    );
  });

  it('should throw error when message body is only whitespace', async () => {
    await expect(useCase.execute('user-2', '   ')).rejects.toThrow(
      'Message body is required',
    );
  });
});
