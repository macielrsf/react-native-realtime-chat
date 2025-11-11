// frontend/src/auth/infrastructure/repositories/AuthRepositoryHttp.ts
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { User } from '../../domain/entities/User';
import { AuthApi } from '../http/AuthApi';
import { AuthMapper } from '../mappers/AuthMapper';

export class AuthRepositoryHttp implements AuthRepository {
  constructor(private readonly authApi: AuthApi) {}

  async login(
    username: string,
    password: string,
  ): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    const response = await this.authApi.login(username, password);
    return AuthMapper.loginResponseToDomain(response);
  }

  async register(
    name: string,
    username: string,
    password: string,
  ): Promise<void> {
    await this.authApi.register(name, username, password);
  }

  async me(): Promise<User> {
    const response = await this.authApi.me();
    return AuthMapper.meResponseToDomain(response);
  }

  async getMe(): Promise<{ user: User }> {
    const user = await this.me();
    return { user };
  }

  async refresh(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const response = await this.authApi.refresh(refreshToken);
    return {
      token: response.accessToken,
      refreshToken: response.refreshToken,
    };
  }
}
