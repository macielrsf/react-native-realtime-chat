// frontend/src/users/domain/repositories/UserRepository.ts
import { UserSummary } from '../entities/UserSummary';

export interface UserRepository {
  list(): Promise<UserSummary[]>;
}
