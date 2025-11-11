// backend/src/server.ts
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDatabase } from "./config/database";
import { createApp } from "./app";
import { ChatSocketHandler } from "./modules/chat/chat.socket";

const onlineUsers = new Set<string>();

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp(onlineUsers);

    // Create HTTP server
    const httpServer = createServer(app);

    // Setup Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    // Setup socket handler
    const chatSocketHandler = new ChatSocketHandler(io, onlineUsers);

    io.on("connection", (socket) => {
      chatSocketHandler.handleConnection(socket);
    });

    // Start server
    httpServer.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info("Shutting down server...");
      httpServer.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
