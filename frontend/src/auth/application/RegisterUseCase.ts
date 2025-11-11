// frontend/src/auth/application/RegisterUseCase.ts
import { AuthRepository } from '../domain/repositories/AuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(
    name: string,
    username: string,
    password: string,
  ): Promise<void> {
    if (!name || !username || !password) {
      throw new Error('All fields are required');
    }

    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return this.authRepository.register(name, username, password);
  }
}
