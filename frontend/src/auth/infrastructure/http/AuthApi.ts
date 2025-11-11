// frontend/src/auth/infrastructure/http/AuthApi.ts
import { HttpClient } from '../../../shared/http/HttpClient';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id: string;
  name: string;
  username: string;
}

export class AuthApi {
  constructor(private readonly httpClient: HttpClient) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/api/auth/login', {
      username,
      password,
    });
  }

  async register(
    name: string,
    username: string,
    password: string,
  ): Promise<void> {
    await this.httpClient.post('/api/auth/register', {
      name,
      username,
      password,
    });
  }

  async me(): Promise<MeResponse> {
    return this.httpClient.get<MeResponse>('/api/auth/me');
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    return this.httpClient.post<RefreshResponse>('/api/auth/refresh', {
      refreshToken,
    });
  }
}
