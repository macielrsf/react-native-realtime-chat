// frontend/src/shared/storage/SecureStorage.ts
import * as Keychain from 'react-native-keychain';
import { TokenStorage } from './TokenStorage';

const SERVICE_NAME = 'rn-chat-app';

export class SecureStorage implements TokenStorage {
  async saveToken(token: string): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      const credentials = {
        accessToken: token,
        refreshToken: refreshToken || '',
      };

      await Keychain.setGenericPassword('auth', JSON.stringify(credentials), {
        service: SERVICE_NAME,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('Error saving access token:', error);
      throw new Error('Failed to save access token');
    }
  }

  async saveRefreshToken(token: string): Promise<void> {
    try {
      const accessToken = await this.getToken();
      const credentials = {
        accessToken: accessToken || '',
        refreshToken: token,
      };

      await Keychain.setGenericPassword('auth', JSON.stringify(credentials), {
        service: SERVICE_NAME,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new Error('Failed to save refresh token');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });

      if (!result) {
        return null;
      }

      const credentials = JSON.parse(result.password);
      return credentials.accessToken || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });

      if (!result) {
        return null;
      }

      const credentials = JSON.parse(result.password);
      return credentials.refreshToken || null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({
        service: SERVICE_NAME,
      });
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw new Error('Failed to clear tokens');
    }
  }
}
