// frontend/src/chat/application/GetUnreadCountsUseCase.ts
import {
  UnreadCountApi,
  UnreadCountData,
} from '../infrastructure/http/UnreadCountApi';

export class GetUnreadCountsUseCase {
  constructor(private unreadCountApi: UnreadCountApi) {}

  async execute(): Promise<UnreadCountData[]> {
    try {
      const unreadCounts = await this.unreadCountApi.getUnreadCounts();
      return unreadCounts;
    } catch (error: any) {
      throw new Error(`Failed to get unread counts: ${error.message}`);
    }
  }
}

export class GetTotalUnreadCountUseCase {
  constructor(private unreadCountApi: UnreadCountApi) {}

  async execute(): Promise<number> {
    try {
      const totalCount = await this.unreadCountApi.getTotalUnreadCount();
      return totalCount;
    } catch (error: any) {
      throw new Error(`Failed to get total unread count: ${error.message}`);
    }
  }
}

export class MarkAsReadUseCase {
  constructor(private unreadCountApi: UnreadCountApi) {}

  async execute(userId: string): Promise<void> {
    try {
      await this.unreadCountApi.markAsRead(userId);
    } catch (error: any) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }
}
