// frontend/__tests__/unit/ListUsersUseCase.test.ts
import { ListUsersUseCase } from '../../src/users/application/ListUsersUseCase';
import { UserRepository } from '../../src/users/domain/repositories/UserRepository';
import { UserSummary } from '../../src/users/domain/entities/UserSummary';

class MockUserRepository implements UserRepository {
  async list(): Promise<UserSummary[]> {
    return [
      UserSummary.create({
        id: 'user-1',
        name: 'Alice',
        username: 'alice',
        online: true,
      }),
      UserSummary.create({
        id: 'user-2',
        name: 'Bob',
        username: 'bob',
        online: false,
      }),
    ];
  }
}

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    useCase = new ListUsersUseCase(repository);
  });

  it('should list all users', async () => {
    const users = await useCase.execute();

    expect(users).toHaveLength(2);
    expect(users[0].username).toBe('alice');
    expect(users[1].username).toBe('bob');
  });

  it('should return empty array when no users exist', async () => {
    jest.spyOn(repository, 'list').mockResolvedValue([]);

    const users = await useCase.execute();

    expect(users).toHaveLength(0);
  });
});
