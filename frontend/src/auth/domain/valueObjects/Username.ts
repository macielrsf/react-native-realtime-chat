// frontend/src/auth/domain/valueObjects/Username.ts
export class Username {
  private constructor(private readonly value: string) {}

  static create(value: string): Username {
    const trimmed = value.trim().toLowerCase();

    if (trimmed.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    return new Username(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
