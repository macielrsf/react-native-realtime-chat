// backend/src/app.ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import { createUserRouter } from "./modules/users/user.routes";
import chatRoutes from "./modules/chat/chat.routes";

export const createApp = (onlineUsers: Set<string>): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan("combined"));

  // Passport
  app.use(passport.initialize());

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/me", authRoutes);
  app.use("/api/users", createUserRouter(onlineUsers));
  app.use("/api/chat", chatRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
