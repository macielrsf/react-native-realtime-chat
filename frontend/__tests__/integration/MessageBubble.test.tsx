// frontend/__tests__/integration/MessageBubble.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { MessageBubble } from '../../src/core/presentation/components/MessageBubble';
import { Message } from '../../src/chat/domain/entities/Message';

describe('MessageBubble Component', () => {
  const mockMessage = Message.create({
    id: 'msg-1',
    from: 'user-1',
    to: 'user-2',
    body: 'Hello World',
    delivered: false,
    createdAt: '2024-01-01T10:30:00.000Z',
    status: 'sent',
  });

  it('should render message body', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} isFromMe={true} />,
    );

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should display sent status for my messages', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} isFromMe={true} />,
    );

    expect(getByText('✓')).toBeTruthy();
  });

  it('should display delivered status', () => {
    const deliveredMessage = mockMessage.withStatus('delivered');

    const { getByText } = render(
      <MessageBubble message={deliveredMessage} isFromMe={true} />,
    );

    expect(getByText('✓✓')).toBeTruthy();
  });

  it('should display failed status with retry button', () => {
    const failedMessage = mockMessage.withStatus('failed');
    const onRetry = jest.fn();

    const { getByText } = render(
      <MessageBubble
        message={failedMessage}
        isFromMe={true}
        onRetry={onRetry}
      />,
    );

    expect(getByText(/Falhou/i)).toBeTruthy();
  });

  it('should not display status for received messages', () => {
    const { queryByText } = render(
      <MessageBubble message={mockMessage} isFromMe={false} />,
    );

    expect(queryByText('✓')).toBeNull();
  });

  it('should display time in correct format', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} isFromMe={true} />,
    );

    // Time should be formatted as HH:MM
    expect(getByText(/\d{1,2}:\d{2}/)).toBeTruthy();
  });
});
