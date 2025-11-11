// frontend/src/auth/application/GetMeUseCase.ts
import { AuthRepository } from '../domain/repositories/AuthRepository';
import { User } from '../domain/entities/User';

export class GetMeUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<{ user: User }> {
    return this.authRepository.getMe();
  }
}
