// frontend/src/users/application/ListUsersUseCase.ts
import { UserRepository } from '../domain/repositories/UserRepository';
import { UserSummary } from '../domain/entities/UserSummary';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserSummary[]> {
    return this.userRepository.list();
  }
}
