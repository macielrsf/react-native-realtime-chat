// backend/src/modules/users/user.service.ts
import { UserModel } from "./user.model";

export interface UserWithOnlineStatus {
  id: string;
  name: string;
  username: string;
  online: boolean;
}

export class UserService {
  async listUsers(
    currentUserId: string,
    onlineUserIds: Set<string>
  ): Promise<UserWithOnlineStatus[]> {
    const users = await UserModel.find({
      _id: { $ne: currentUserId },
    }).select("_id name username");

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      online: onlineUserIds.has(user._id.toString()),
    }));
  }
}
