// backend/src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, refreshSchema } from "./auth.types";
import passport from "../../config/passport";
import { AuthRequest } from "../../middlewares/isAuthenticated";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      await this.authService.register(data);

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);

      passport.authenticate(
        "local",
        { session: false },
        async (err: any, user: any, info: any) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            return res.status(401).json({
              status: "error",
              message: info?.message || "Invalid credentials",
            });
          }

          const result = await this.authService.login(user);

          res.json({
            status: "success",
            data: result,
          });
        }
      )(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      const result = await this.authService.refresh(refreshToken);

      res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const user = await this.authService.getMe(req.user.userId);

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
