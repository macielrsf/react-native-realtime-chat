// frontend/src/users/infrastructure/http/UsersApi.ts
import { HttpClient } from '../../../shared/http/HttpClient';

export interface UserDto {
  id: string;
  name: string;
  username: string;
  online: boolean;
}

export class UsersApi {
  constructor(private readonly httpClient: HttpClient) {}

  async listUsers(): Promise<UserDto[]> {
    return this.httpClient.get<UserDto[]>('/api/users');
  }
}
