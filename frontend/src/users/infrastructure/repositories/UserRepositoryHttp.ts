// frontend/src/users/infrastructure/repositories/UserRepositoryHttp.ts
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserSummary } from '../../domain/entities/UserSummary';
import { UsersApi } from '../http/UsersApi';
import { UsersMapper } from '../mappers/UsersMapper';

export class UserRepositoryHttp implements UserRepository {
  constructor(private readonly usersApi: UsersApi) {}

  async list(): Promise<UserSummary[]> {
    const dtos = await this.usersApi.listUsers();
    return UsersMapper.dtoListToDomain(dtos);
  }
}
