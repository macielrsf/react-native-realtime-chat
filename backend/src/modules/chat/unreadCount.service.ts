import { UnreadCountModel, IUnreadCount } from "./unreadCount.model";
import { logger } from "../../config/logger";

export class UnreadCountService {
  /**
   * Incrementa a contagem de mensagens não lidas para um usuário específico
   */
  async incrementUnreadCount(
    userId: string,
    conversationWith: string
  ): Promise<IUnreadCount> {
    try {
      const unreadCount = await UnreadCountModel.findOneAndUpdate(
        { userId, conversationWith },
        {
          $inc: { count: 1 },
          $set: { lastMessageAt: new Date() },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      logger.info(
        `Incremented unread count for user ${userId} with ${conversationWith}: ${unreadCount.count}`
      );

      return unreadCount;
    } catch (error) {
      logger.error("Error incrementing unread count:", error);
      throw new Error("Failed to increment unread count");
    }
  }

  /**
   * Marca todas as mensagens como lidas para uma conversa específica
   */
  async markAsRead(userId: string, conversationWith: string): Promise<boolean> {
    try {
      await UnreadCountModel.findOneAndUpdate(
        { userId, conversationWith },
        {
          $set: { count: 0, lastMessageAt: new Date() },
        },
        { new: true, upsert: true } // Criar documento se não existir
      );

      logger.info(
        `Marked messages as read for user ${userId} with ${conversationWith}`
      );

      return true; // Sempre retorna true pois upsert garante o resultado
    } catch (error) {
      logger.error("Error marking messages as read:", error);
      throw new Error("Failed to mark messages as read");
    }
  }

  /**
   * Busca todas as contagens de mensagens não lidas para um usuário
   */
  async getUserUnreadCounts(userId: string): Promise<
    Array<{
      conversationWith: string;
      count: number;
      lastMessageAt: Date;
    }>
  > {
    try {
      const unreadCounts = await UnreadCountModel.find(
        { userId, count: { $gt: 0 } },
        { conversationWith: 1, count: 1, lastMessageAt: 1, _id: 0 }
      ).sort({ lastMessageAt: -1 });

      return unreadCounts;
    } catch (error) {
      logger.error("Error fetching user unread counts:", error);
      throw new Error("Failed to fetch unread counts");
    }
  }

  /**
   * Busca o total de mensagens não lidas para um usuário
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      const result = await UnreadCountModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]);

      return result.length > 0 ? result[0].total : 0;
    } catch (error) {
      logger.error("Error fetching total unread count:", error);
      throw new Error("Failed to fetch total unread count");
    }
  }

  /**
   * Limpa todas as contagens de mensagens não lidas para um usuário
   */
  async clearAllUnreadCounts(userId: string): Promise<boolean> {
    try {
      await UnreadCountModel.updateMany({ userId }, { $set: { count: 0 } });

      logger.info(`Cleared all unread counts for user ${userId}`);
      return true;
    } catch (error) {
      logger.error("Error clearing unread counts:", error);
      throw new Error("Failed to clear unread counts");
    }
  }

  /**
   * Remove registros antigos com contagem zero (limpeza)
   */
  async cleanupOldRecords(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await UnreadCountModel.deleteMany({
        count: 0,
        updatedAt: { $lt: cutoffDate },
      });

      logger.info(`Cleaned up ${result.deletedCount} old unread count records`);
      return result.deletedCount || 0;
    } catch (error) {
      logger.error("Error cleaning up old records:", error);
      throw new Error("Failed to cleanup old records");
    }
  }
}
