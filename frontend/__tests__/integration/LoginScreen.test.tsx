// frontend/__tests__/integration/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { LoginScreen } from '../../src/auth/presentation/screens/LoginScreen';

// Mock do AuthViewModel
jest.mock('../../src/auth/presentation/viewmodels/useAuthViewModel', () => ({
  useAuthViewModel: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
  }),
}));

let mockLogin = jest.fn();

describe('LoginScreen', () => {
  beforeEach(() => {
    mockLogin = jest.fn().mockResolvedValue(true);
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render login form', () => {
    const { getByTestId } = render(<LoginScreen />);

    expect(getByTestId('username-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('should update username input', () => {
    const { getByTestId } = render(<LoginScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'testuser');

    expect(usernameInput.props.value).toBe('testuser');
  });

  it('should update password input', () => {
    const { getByTestId } = render(<LoginScreen />);

    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'password123');

    expect(passwordInput.props.value).toBe('password123');
  });

  it('should show alert when username is empty', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'password123');

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show alert when password is empty', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const usernameInput = getByTestId('username-input');
    fireEvent.changeText(usernameInput, 'testuser');

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login with trimmed credentials', async () => {
    const { getByTestId } = render(<LoginScreen />);

    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(usernameInput, '  testuser  ');
    fireEvent.changeText(passwordInput, 'password123');

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('should show alert on login failure', async () => {
    mockLogin = jest.fn().mockResolvedValue(false);

    const { getByTestId } = render(<LoginScreen />);

    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(usernameInput, 'wronguser');
    fireEvent.changeText(passwordInput, 'wrongpass');

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('should render theme toggle', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('theme-toggle')).toBeTruthy();
  });

  it('should render language switcher', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('language-switcher')).toBeTruthy();
  });
});
