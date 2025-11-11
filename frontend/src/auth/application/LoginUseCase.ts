// frontend/src/auth/application/LoginUseCase.ts
import { AuthRepository } from '../domain/repositories/AuthRepository';
import { User } from '../domain/entities/User';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(
    username: string,
    password: string,
  ): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    return this.authRepository.login(username, password);
  }
}
