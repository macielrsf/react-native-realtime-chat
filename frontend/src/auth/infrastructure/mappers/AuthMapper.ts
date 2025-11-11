// frontend/src/auth/infrastructure/mappers/AuthMapper.ts
import { User } from '../../domain/entities/User';
import { LoginResponse, MeResponse } from '../http/AuthApi';

export class AuthMapper {
  static loginResponseToDomain(response: LoginResponse): {
    token: string;
    refreshToken: string;
    user: User;
  } {
    return {
      token: response.accessToken,
      refreshToken: response.refreshToken,
      user: User.create({
        id: response.user.id,
        name: response.user.name,
        username: response.user.username,
      }),
    };
  }

  static meResponseToDomain(response: MeResponse): User {
    return User.create({
      id: response.id,
      name: response.name,
      username: response.username,
    });
  }
}
