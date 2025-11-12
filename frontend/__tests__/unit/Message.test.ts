// frontend/__tests__/unit/Message.test.ts
import { Message } from '../../src/chat/domain/entities/Message';

describe('Message Entity', () => {
  const mockData = {
    id: 'msg-1',
    from: 'user-1',
    to: 'user-2',
    body: 'Hello World',
    delivered: false,
    createdAt: '2024-01-01T10:00:00.000Z',
  };

  it('should create a message', () => {
    const message = Message.create(mockData);

    expect(message.id).toBe('msg-1');
    expect(message.from).toBe('user-1');
    expect(message.to).toBe('user-2');
    expect(message.body).toBe('Hello World');
    expect(message.delivered).toBe(false);
    expect(message.createdAt).toEqual(new Date('2024-01-01T10:00:00.000Z'));
  });

  it('should set status to "sent" when delivered is false', () => {
    const message = Message.create(mockData);

    expect(message.status).toBe('sent');
  });

  it('should set status to "delivered" when delivered is true', () => {
    const message = Message.create({
      ...mockData,
      delivered: true,
      deliveredAt: '2024-01-01T10:05:00.000Z',
    });

    expect(message.status).toBe('delivered');
    expect(message.deliveredAt).toEqual(new Date('2024-01-01T10:05:00.000Z'));
  });

  it('should use provided status', () => {
    const message = Message.create({
      ...mockData,
      status: 'sending',
    });

    expect(message.status).toBe('sending');
  });

  it('should check if message is from me', () => {
    const message = Message.create(mockData);

    expect(message.isFromMe('user-1')).toBe(true);
    expect(message.isFromMe('user-2')).toBe(false);
  });

  it('should create new message with updated status', () => {
    const message = Message.create(mockData);
    const updatedMessage = message.withStatus('failed');

    expect(message.status).toBe('sent'); // Original unchanged
    expect(updatedMessage.status).toBe('failed');
    expect(updatedMessage.id).toBe(message.id);
    expect(updatedMessage.body).toBe(message.body);
  });

  it('should handle null deliveredAt', () => {
    const message = Message.create(mockData);

    expect(message.deliveredAt).toBeNull();
  });
});
