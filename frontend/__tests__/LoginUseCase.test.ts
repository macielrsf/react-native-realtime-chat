// frontend/__tests__/LoginUseCase.test.ts
import { LoginUseCase } from '../src/auth/application/LoginUseCase';
import { AuthRepository } from '../src/auth/domain/repositories/AuthRepository';
import { User } from '../src/auth/domain/entities/User';

// Mock repository
class MockAuthRepository implements AuthRepository {
  async login(username: string, password: string) {
    if (username === 'testuser' && password === 'password123') {
      return {
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        user: User.create({
          id: '1',
          name: 'Test User',
          username: 'testuser',
        }),
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(): Promise<void> {
    throw new Error('Not implemented');
  }

  async me(): Promise<User> {
    throw new Error('Not implemented');
  }

  async refresh() {
    throw new Error('Not implemented');
  }
}

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let repository: MockAuthRepository;

  beforeEach(() => {
    repository = new MockAuthRepository();
    useCase = new LoginUseCase(repository);
  });

  it('should login successfully with valid credentials', async () => {
    const result = await useCase.execute('testuser', 'password123');

    expect(result.token).toBe('mock-token');
    expect(result.user.username).toBe('testuser');
  });

  it('should throw error with invalid credentials', async () => {
    await expect(useCase.execute('wronguser', 'wrongpass')).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('should throw error when username is empty', async () => {
    await expect(useCase.execute('', 'password123')).rejects.toThrow(
      'Username and password are required',
    );
  });

  it('should throw error when password is empty', async () => {
    await expect(useCase.execute('testuser', '')).rejects.toThrow(
      'Username and password are required',
    );
  });
});
