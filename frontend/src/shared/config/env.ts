// frontend/src/shared/config/env.ts
import { Platform } from 'react-native';

const getApiUrl = (): string => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:3001';
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

export const env = {
  apiUrl: getApiUrl(),
  wsUrl: getApiUrl(),
};
