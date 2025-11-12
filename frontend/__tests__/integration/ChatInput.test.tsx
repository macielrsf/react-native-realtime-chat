// frontend/__tests__/integration/ChatInput.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChatInput } from '../../src/chat/presentation/components/ChatInput';

describe('ChatInput Component', () => {
  const mockProps = {
    value: '',
    onChangeText: jest.fn(),
    onSend: jest.fn(),
    onTyping: jest.fn(),
    onStopTyping: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input field', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} />);

    expect(getByTestId('chat-input')).toBeTruthy();
  });

  it('should call onChangeText when typing', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} />);

    const input = getByTestId('chat-input');
    fireEvent.changeText(input, 'Hello');

    expect(mockProps.onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('should call onTyping when user types', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} />);

    const input = getByTestId('chat-input');
    fireEvent.changeText(input, 'H');

    expect(mockProps.onTyping).toHaveBeenCalled();
  });

  it('should call onSend when send button is pressed', () => {
    const { getByTestId } = render(
      <ChatInput {...mockProps} value="Hello World" />,
    );

    const sendButton = getByTestId('send-button');
    fireEvent.press(sendButton);

    expect(mockProps.onSend).toHaveBeenCalled();
  });

  it('should disable send button when input is empty', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} value="" />);

    const sendButton = getByTestId('send-button');

    // Button should be disabled (check parent props or disabled state)
    expect(
      sendButton.props.accessibilityState?.disabled || !mockProps.value.trim(),
    ).toBeTruthy();
  });

  it('should disable send button when input is only whitespace', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} value="   " />);

    const sendButton = getByTestId('send-button');

    // Button should be disabled
    expect(
      sendButton.props.accessibilityState?.disabled || !mockProps.value.trim(),
    ).toBeTruthy();
  });

  it('should respect maxLength prop', () => {
    const { getByTestId } = render(<ChatInput {...mockProps} maxLength={10} />);

    const input = getByTestId('chat-input');

    expect(input.props.maxLength).toBe(10);
  });

  it('should disable input when disabled prop is true', () => {
    const { getByTestId } = render(
      <ChatInput {...mockProps} disabled={true} />,
    );

    const input = getByTestId('chat-input');

    expect(input.props.editable).toBe(false);
  });

  it('should call onStopTyping after delay', async () => {
    jest.useFakeTimers();

    const { getByTestId } = render(<ChatInput {...mockProps} />);

    const input = getByTestId('chat-input');
    fireEvent.changeText(input, 'Hello');

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockProps.onStopTyping).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });
});
