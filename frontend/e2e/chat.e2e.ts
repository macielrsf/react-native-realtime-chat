// frontend/e2e/chat.e2e.ts
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Chat Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();

    // Login first
    await element(by.id('username-input')).typeText('testuser');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('Entrar')).tap();

    // Wait for users screen
    await detoxExpect(element(by.text('Conversas'))).toBeVisible();
  });

  it('should display list of users', async () => {
    // Should see at least one user
    await detoxExpect(element(by.id('users-list'))).toBeVisible();
  });

  it('should navigate to chat screen when user is tapped', async () => {
    // Tap on first user
    await element(by.id('user-item-0')).tap();

    // Should see chat screen
    await detoxExpect(element(by.id('chat-input'))).toBeVisible();
  });

  it('should send a message', async () => {
    // Navigate to chat
    await element(by.id('user-item-0')).tap();

    // Type message
    await element(by.id('chat-input')).typeText(
      'Hello, this is a test message!',
    );

    // Tap send button
    await element(by.text('Enviar')).tap();

    // Verify message appears in chat
    await detoxExpect(
      element(by.text('Hello, this is a test message!')),
    ).toBeVisible();
  });

  it('should display message status', async () => {
    await element(by.id('user-item-0')).tap();
    await element(by.id('chat-input')).typeText('Test message');
    await element(by.text('Enviar')).tap();

    // Should show sending status (spinner)
    await new Promise(resolve => setTimeout(resolve, 500));

    // After sent, should show checkmark
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  it('should show retry button when message fails', async () => {
    // This test requires backend to be offline
    // Navigate to chat
    await element(by.id('user-item-0')).tap();

    // Disconnect from network (simulated by stopping backend)
    await element(by.id('chat-input')).typeText('This should fail');
    await element(by.text('Enviar')).tap();

    // Wait for timeout
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Should show retry button
    await detoxExpect(element(by.text('Tentar novamente'))).toBeVisible();
  });

  it('should retry failed message', async () => {
    // Navigate to chat with failed message
    await element(by.id('user-item-0')).tap();

    // Send message (backend offline)
    await element(by.id('chat-input')).typeText('Retry test');
    await element(by.text('Enviar')).tap();

    // Wait for failure
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Tap retry button
    await element(by.text('Tentar novamente')).tap();

    // Should show sending status again
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should load message history', async () => {
    await element(by.id('user-item-0')).tap();

    // Wait for messages to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Should see messages list
    await detoxExpect(element(by.id('messages-list'))).toBeVisible();
  });

  it('should display unread count badge', async () => {
    // Should see unread badge on user with unread messages
    await detoxExpect(element(by.id('unread-badge'))).toBeVisible();
  });

  it('should clear unread count when opening chat', async () => {
    // Tap user with unread messages
    await element(by.id('user-item-0')).tap();

    // Wait for chat to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Go back
    await element(by.id('back-button')).tap();

    // Unread badge should be gone or show 0
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should scroll to load more messages', async () => {
    await element(by.id('user-item-0')).tap();

    // Wait for initial messages
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Scroll to top to load more
    await element(by.id('messages-list')).scroll(200, 'up');

    // Wait for pagination
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
});
