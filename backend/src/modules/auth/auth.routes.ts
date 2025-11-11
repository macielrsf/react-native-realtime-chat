// backend/src/modules/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", isAuthenticated, authController.getMe);

export default router;
