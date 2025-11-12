// frontend/__tests__/unit/Username.test.ts
import { Username } from '../../src/auth/domain/valueObjects/Username';

describe('Username Value Object', () => {
  it('should create a valid username', () => {
    const username = Username.create('alice');

    expect(username.getValue()).toBe('alice');
  });

  it('should trim and lowercase username', () => {
    const username = Username.create('  ALICE  ');

    expect(username.getValue()).toBe('alice');
  });

  it('should throw error when username is too short', () => {
    expect(() => Username.create('ab')).toThrow(
      'Username must be at least 3 characters',
    );
  });

  it('should throw error when username is empty', () => {
    expect(() => Username.create('')).toThrow(
      'Username must be at least 3 characters',
    );
  });

  it('should throw error when username is only whitespace', () => {
    expect(() => Username.create('   ')).toThrow(
      'Username must be at least 3 characters',
    );
  });

  it('should accept username with exactly 3 characters', () => {
    const username = Username.create('bob');

    expect(username.getValue()).toBe('bob');
  });

  it('should compare usernames for equality', () => {
    const username1 = Username.create('alice');
    const username2 = Username.create('alice');
    const username3 = Username.create('bob');

    expect(username1.equals(username2)).toBe(true);
    expect(username1.equals(username3)).toBe(false);
  });

  it('should compare usernames case-insensitively', () => {
    const username1 = Username.create('ALICE');
    const username2 = Username.create('alice');

    expect(username1.equals(username2)).toBe(true);
  });
});
