// frontend/__tests__/integration/MessageStatus.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MessageStatus } from '../../src/core/presentation/components/MessageStatus';

describe('MessageStatus Component', () => {
  it('should render sending status with spinner', () => {
    const { getByText } = render(<MessageStatus status="sending" />);

    expect(getByText(/Enviando/i)).toBeTruthy();
  });

  it('should render sent status with single checkmark', () => {
    const { getByText } = render(<MessageStatus status="sent" />);

    expect(getByText('✓')).toBeTruthy();
  });

  it('should render delivered status with double checkmark', () => {
    const { getByText } = render(<MessageStatus status="delivered" />);

    expect(getByText('✓✓')).toBeTruthy();
  });

  it('should render failed status with error message', () => {
    const { getByText } = render(<MessageStatus status="failed" />);

    // The emoji and text are in the same element
    expect(getByText(/❌.*Falhou/i)).toBeTruthy();
  });

  it('should render retry button when status is failed and onRetry is provided', () => {
    const onRetry = jest.fn();

    const { getByText } = render(
      <MessageStatus status="failed" onRetry={onRetry} />,
    );

    expect(getByText(/Tentar novamente/i)).toBeTruthy();
  });

  it('should call onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();

    const { getByText } = render(
      <MessageStatus status="failed" onRetry={onRetry} />,
    );

    const retryButton = getByText(/Tentar novamente/i);
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<MessageStatus status="failed" />);

    expect(queryByText(/Tentar novamente/i)).toBeNull();
  });
});
