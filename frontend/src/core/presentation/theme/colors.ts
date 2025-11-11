// frontend/src/core/presentation/theme/colors.ts

export interface ColorTheme {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;

  background: string;
  surface: string;
  border: string;
  card: string;

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  message: {
    sent: string;
    received: string;
    sentText: string;
    receivedText: string;
  };

  online: string;
  offline: string;
}

export const lightColors: ColorTheme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',

  background: '#FFFFFF',
  surface: '#F2F2F7',
  border: '#C6C6C8',
  card: '#FFFFFF',

  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
  },

  message: {
    sent: '#007AFF',
    received: '#E9E9EB',
    sentText: '#FFFFFF',
    receivedText: '#000000',
  },

  online: '#34C759',
  offline: '#8E8E93',
};

export const darkColors: ColorTheme = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#30D158',
  danger: '#FF453A',
  warning: '#FF9F0A',

  background: '#000000',
  surface: '#1C1C1E',
  border: '#38383A',
  card: '#1C1C1E',

  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#8E8E93',
    inverse: '#000000',
  },

  message: {
    sent: '#0A84FF',
    received: '#2C2C2E',
    sentText: '#FFFFFF',
    receivedText: '#FFFFFF',
  },

  online: '#30D158',
  offline: '#8E8E93',
};

// Legacy export for backward compatibility
export const colors = lightColors;
