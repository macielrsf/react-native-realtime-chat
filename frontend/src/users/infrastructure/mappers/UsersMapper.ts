// frontend/src/users/infrastructure/mappers/UsersMapper.ts
import { UserSummary } from '../../domain/entities/UserSummary';
import { UserDto } from '../http/UsersApi';

export class UsersMapper {
  static dtoToDomain(dto: UserDto): UserSummary {
    return UserSummary.create({
      id: dto.id,
      name: dto.name,
      username: dto.username,
      online: dto.online,
    });
  }

  static dtoListToDomain(dtos: UserDto[]): UserSummary[] {
    return dtos.map(dto => this.dtoToDomain(dto));
  }
}
