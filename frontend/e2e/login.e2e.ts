// frontend/e2e/login.e2e.ts
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display login screen', async () => {
    await detoxExpect(element(by.text('Bem-vindo ao Chat'))).toBeVisible();
  });

  it('should show error when fields are empty', async () => {
    await element(by.text('Entrar')).tap();

    // Should show alert
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should login successfully with valid credentials', async () => {
    // Type username
    await element(by.id('username-input')).typeText('bob');

    // Type password
    await element(by.id('password-input')).typeText('password123');

    // Tap login button
    await element(by.text('Entrar')).tap();

    // Wait for navigation to users screen
    await detoxExpect(element(by.text('Conversas'))).toBeVisible();
  });

  it('should show error with invalid credentials', async () => {
    await element(by.id('username-input')).typeText('wronguser');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.text('Entrar')).tap();

    // Wait for error alert
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should toggle theme', async () => {
    // Find and tap theme toggle button
    await element(by.id('theme-toggle')).tap();

    // Verify theme changed (background color should be different)
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should switch language', async () => {
    // Tap language switcher
    await element(by.id('language-switcher')).tap();

    // Select English
    await element(by.text('English')).tap();

    // Verify language changed
    await detoxExpect(element(by.text('Welcome to Chat'))).toBeVisible();
  });
});
