// backend/src/modules/chat/chat.routes.ts
import { Router } from "express";
import { ChatController } from "./chat.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const router = Router();
const chatController = new ChatController();

router.get("/:userId/messages", isAuthenticated, (req, res, next) =>
  chatController.getMessages(req as any, res, next)
);
router.get("/unread-counts", isAuthenticated, (req, res, next) =>
  chatController.getUnreadCounts(req as any, res, next)
);
router.get("/unread-counts/total", isAuthenticated, (req, res, next) =>
  chatController.getTotalUnreadCount(req as any, res, next)
);
router.put("/:userId/mark-as-read", isAuthenticated, (req, res, next) =>
  chatController.markAsRead(req as any, res, next)
);

export default router;
