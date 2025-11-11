// frontend/src/chat/infrastructure/http/UnreadCountApi.ts
import { HttpClient } from '../../../shared/http/HttpClient';

export interface UnreadCountData {
  conversationWith: string;
  count: number;
  lastMessageAt: string;
}

export interface TotalUnreadCountData {
  totalCount: number;
}

export class UnreadCountApi {
  constructor(private httpClient: HttpClient) {}

  async getUnreadCounts(): Promise<UnreadCountData[]> {
    const response = await this.httpClient.get<{
      status: string;
      data: UnreadCountData[];
    }>('/api/chat/unread-counts');

    // Handle both direct data return and wrapped response
    if (response && typeof response === 'object') {
      // If response has status property, it's the full response object
      if ('status' in response && 'data' in response) {
        if (response.status !== 'success') {
          throw new Error('Failed to fetch unread counts');
        }
        return response.data;
      }
      // If it's an array, it's already the extracted data
      if (Array.isArray(response)) {
        return response;
      }
    }

    throw new Error('Unexpected response format');
  }

  async getTotalUnreadCount(): Promise<number> {
    const response = await this.httpClient.get<{
      status: string;
      data: TotalUnreadCountData;
    }>('/api/chat/unread-counts/total');

    // Handle both direct data return and wrapped response
    if (response && typeof response === 'object') {
      // If response has status property, it's the full response object
      if ('status' in response && 'data' in response) {
        if (response.status !== 'success') {
          throw new Error('Failed to fetch total unread count');
        }
        return response.data.totalCount;
      }
      // If it's a direct object with totalCount
      if ('totalCount' in response) {
        return (response as TotalUnreadCountData).totalCount;
      }
    }

    throw new Error('Unexpected response format');
  }

  async markAsRead(userId: string): Promise<void> {
    const response = await this.httpClient.put<{
      status: string;
      message: string;
    }>(`/api/chat/${userId}/mark-as-read`);

    // Handle both direct data return and wrapped response
    if (response && typeof response === 'object') {
      // If response has status property, it's the full response object
      if ('status' in response) {
        if (response.status !== 'success') {
          throw new Error('Failed to mark messages as read');
        }
        return;
      }
    }

    // If no status, assume success (some responses might just return empty)
  }
}
