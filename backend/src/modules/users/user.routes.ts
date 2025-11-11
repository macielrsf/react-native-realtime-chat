// backend/src/modules/users/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

export const createUserRouter = (onlineUsers: Set<string>): Router => {
  const router = Router();
  const userController = new UserController(onlineUsers);

  router.get("/", isAuthenticated, userController.listUsers);

  return router;
};
