// frontend/src/auth/domain/repositories/AuthRepository.ts
import { User } from '../entities/User';

export interface AuthRepository {
  login(
    username: string,
    password: string,
  ): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }>;

  register(name: string, username: string, password: string): Promise<void>;

  me(): Promise<User>;

  getMe(): Promise<{ user: User }>;

  refresh(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }>;
}
