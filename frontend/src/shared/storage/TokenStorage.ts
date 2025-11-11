// frontend/src/shared/storage/TokenStorage.ts
export interface TokenStorage {
  saveToken(token: string): Promise<void>;
  saveRefreshToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clearTokens(): Promise<void>;
}
