// backend/src/modules/auth/auth.service.ts
import { UserModel, IUser } from "../users/user.model";
import { hashPassword } from "../../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";
import { RegisterDto } from "./auth.types";

export class AuthService {
  async register(data: RegisterDto): Promise<void> {
    const existingUser = await UserModel.findOne({ username: data.username });

    if (existingUser) {
      throw new AppError(400, "Username already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    await UserModel.create({
      name: data.name,
      username: data.username,
      password: hashedPassword,
    });
  }

  async login(user: IUser): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
  }> {
    const payload = {
      userId: user._id.toString(),
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
      },
    };
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new AppError(401, "User not found");
    }

    const newPayload = {
      userId: user._id.toString(),
      username: user.username,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getMe(userId: string): Promise<{
    id: string;
    name: string;
    username: string;
  }> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
    };
  }
}
