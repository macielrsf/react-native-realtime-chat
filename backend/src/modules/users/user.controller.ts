// backend/src/modules/users/user.controller.ts
import { Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { AuthRequest } from "../../middlewares/isAuthenticated";

export class UserController {
  private userService: UserService;

  constructor(private onlineUsers: Set<string>) {
    this.userService = new UserService();
  }

  listUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const users = await this.userService.listUsers(
        req.user.userId,
        this.onlineUsers
      );

      res.json({
        status: "success",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}
