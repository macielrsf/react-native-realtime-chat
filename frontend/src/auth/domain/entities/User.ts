// frontend/src/auth/domain/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly username: string,
  ) {}

  static create(data: { id: string; name: string; username: string }): User {
    return new User(data.id, data.name, data.username);
  }
}
