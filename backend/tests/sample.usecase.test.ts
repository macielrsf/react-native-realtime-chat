// backend/tests/sample.usecase.test.ts
import { hashPassword, verifyPassword } from "../src/utils/hash";

describe("Hash Utils - Sample Unit Test", () => {
  it("should hash a password and verify it correctly", async () => {
    const password = "testPassword123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(0);

    const isValid = await verifyPassword(password, hashed);
    expect(isValid).toBe(true);
  });

  it("should return false for invalid password", async () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword";
    const hashed = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hashed);
    expect(isValid).toBe(false);
  });
});
