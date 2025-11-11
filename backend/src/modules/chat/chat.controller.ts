// backend/src/modules/chat/chat.controller.ts
import { Response, NextFunction } from "express";
import { ChatService } from "./chat.service";
import { AuthRequest } from "../../middlewares/isAuthenticated";

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  getMessages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const before = req.query.before as string | undefined;

      const messages = await this.chatService.getMessages(
        req.user.userId,
        userId,
        limit,
        before
      );

      return res.json({
        status: "success",
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  };

  getUnreadCounts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const unreadCounts = await this.chatService.getUserUnreadCounts(
        req.user.userId
      );

      return res.json({
        status: "success",
        data: unreadCounts,
      });
    } catch (error) {
      next(error);
    }
  };

  getTotalUnreadCount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const totalCount = await this.chatService.getTotalUnreadCount(
        req.user.userId
      );

      return res.json({
        status: "success",
        data: { totalCount },
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const { userId } = req.params;

      const success = await this.chatService.markMessagesAsRead(
        req.user.userId,
        userId
      );

      if (success) {
        return res.json({
          status: "success",
          message: "Messages marked as read",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Conversation not found",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  getConversationsWithLastMessage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const conversations =
        await this.chatService.getUserConversationsWithLastMessage(
          req.user.userId
        );

      return res.json({
        status: "success",
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  };
}
