// frontend/__tests__/unit/LoadHistoryUseCase.test.ts
import { LoadHistoryUseCase } from '../../src/chat/application/LoadHistoryUseCase';
import { ChatRepository } from '../../src/chat/domain/repositories/ChatRepository';
import { Message } from '../../src/chat/domain/entities/Message';
import { ConversationSummary } from '../../src/chat/application/GetConversationsUseCase';

class MockChatRepository implements ChatRepository {
  async getMessages(
    userId: string,
    limit?: number,
    before?: string,
  ): Promise<Message[]> {
    const messages = [
      Message.create({
        id: 'msg-1',
        from: userId,
        to: 'user-2',
        body: 'Message 1',
        delivered: true,
        createdAt: '2024-01-01T10:00:00.000Z',
      }),
      Message.create({
        id: 'msg-2',
        from: 'user-2',
        to: userId,
        body: 'Message 2',
        delivered: true,
        createdAt: '2024-01-01T11:00:00.000Z',
      }),
    ];

    return messages.slice(0, limit);
  }

  async sendMessage(): Promise<Message> {
    throw new Error('Not implemented');
  }

  async getConversationsWithLastMessage(): Promise<ConversationSummary[]> {
    return [];
  }
}

describe('LoadHistoryUseCase', () => {
  let useCase: LoadHistoryUseCase;
  let repository: MockChatRepository;

  beforeEach(() => {
    repository = new MockChatRepository();
    useCase = new LoadHistoryUseCase(repository);
  });

  it('should load messages for a user', async () => {
    const messages = await useCase.execute('user-1');

    expect(messages).toHaveLength(2);
    expect(messages[0].body).toBe('Message 1');
    expect(messages[1].body).toBe('Message 2');
  });

  it('should respect limit parameter', async () => {
    const messages = await useCase.execute('user-1', 1);

    expect(messages).toHaveLength(1);
  });

  it('should use default limit of 50', async () => {
    const spy = jest.spyOn(repository, 'getMessages');

    await useCase.execute('user-1');

    expect(spy).toHaveBeenCalledWith('user-1', 50, undefined);
  });

  it('should throw error when user ID is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('User ID is required');
  });

  it('should pass before parameter to repository', async () => {
    const spy = jest.spyOn(repository, 'getMessages');

    await useCase.execute('user-1', 20, 'msg-10');

    expect(spy).toHaveBeenCalledWith('user-1', 20, 'msg-10');
  });
});
