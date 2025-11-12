// frontend/__tests__/setup.ts
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() =>
    Promise.resolve({ username: 'token', password: 'mock-token' }),
  ),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

// Mock Socket.IO
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connected: false,
  }));
});

// Mock i18n - useLanguage hook and LanguageProvider
jest.mock('../src/shared/i18n', () => {
  return {
    useLanguage: jest.fn(() => ({
      currentLanguage: 'pt-BR',
      changeLanguage: jest.fn(),
      t: (key: string) => {
        // Simplified translation function that returns common translations
        const translations: Record<string, string> = {
          // Auth
          'auth.login.title': 'Bem-vindo de Volta',
          'auth.login.subtitle': 'Faça login para continuar',
          'auth.login.username': 'Nome de usuário',
          'auth.login.usernamePlace': 'Digite seu nome de usuário',
          'auth.login.password': 'Senha',
          'auth.login.passwordPlace': 'Digite sua senha',
          'auth.login.signIn': 'Entrar',
          'auth.login.signInLoading': 'Entrando...',
          'auth.errors.emptyFields':
            'Por favor, insira nome de usuário e senha',
          'auth.errors.loginFailed': 'Falha no Login',
          'auth.errors.invalidCredentials': 'Credenciais inválidas',

          // Chat
          'chat.input.placeholder': 'Digite uma mensagem...',
          'chat.input.send': 'Enviar',
          'chat.message.sending': 'Enviando...',
          'chat.message.sent': 'Enviado',
          'chat.message.delivered': 'Entregue',
          'chat.message.failed': 'Falhou',
          'chat.message.retry': 'Tentar novamente',

          // Users
          'users.title': 'Conversas',
          'users.online': 'Online',
          'users.offline': 'Offline',
          'users.status.online': 'Online',
          'users.status.offline': 'Offline',

          // Core
          'core.common.error': 'Erro',
          'core.common.success': 'Sucesso',
          'core.theme.dark': 'Escuro',
          'core.theme.light': 'Claro',
        };

        return translations[key] || key;
      },
    })),
    LanguageProvider: ({ children }: any) => children,
  };
});

// Mock Theme Context
jest.mock('../src/core/presentation/theme/ThemeContext', () => {
  const mockTheme = {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#007AFF',
    danger: '#FF3B30',
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#FFFFFF',
    },
    border: '#E0E0E0',
    message: {
      sent: '#007AFF',
      sentText: '#FFFFFF',
      received: '#E5E5EA',
      receivedText: '#000000',
    },
  };

  return {
    useTheme: jest.fn(() => ({
      theme: mockTheme,
      isDark: false,
      toggleTheme: jest.fn(),
    })),
    ThemeProvider: ({ children }: any) => children,
  };
});

// Silence console warnings during tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn(),
};
