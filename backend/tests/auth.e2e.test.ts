// backend/tests/auth.e2e.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/database";
import { UserModel } from "../src/modules/users/user.model";

const onlineUsers = new Set<string>();
const app = createApp(onlineUsers);

describe("Auth E2E Tests", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("User registered successfully");
    });

    it("should return 400 if username already exists", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        username: "testuser",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "Another User",
        username: "testuser",
        password: "password456",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        username: "testuser",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user.username).toBe("testuser");
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
    });
  });
});
