// frontend/src/users/domain/entities/UserSummary.ts
export class UserSummary {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly username: string,
    public readonly online: boolean,
  ) {}

  static create(data: {
    id: string;
    name: string;
    username: string;
    online: boolean;
  }): UserSummary {
    return new UserSummary(data.id, data.name, data.username, data.online);
  }
}
