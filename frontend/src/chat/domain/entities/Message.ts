// frontend/src/chat/domain/entities/Message.ts
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed';

export class Message {
  constructor(
    public readonly id: string,
    public readonly from: string,
    public readonly to: string,
    public readonly body: string,
    public readonly delivered: boolean,
    public readonly deliveredAt: Date | null,
    public readonly createdAt: Date,
    public status?: MessageStatus, // Optional for backwards compatibility
  ) {}

  static create(data: {
    id: string;
    from: string;
    to: string;
    body: string;
    delivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    status?: MessageStatus;
  }): Message {
    return new Message(
      data.id,
      data.from,
      data.to,
      data.body,
      data.delivered,
      data.deliveredAt ? new Date(data.deliveredAt) : null,
      new Date(data.createdAt),
      data.status || (data.delivered ? 'delivered' : 'sent'),
    );
  }

  isFromMe(userId: string): boolean {
    return this.from === userId;
  }

  withStatus(status: MessageStatus): Message {
    return new Message(
      this.id,
      this.from,
      this.to,
      this.body,
      this.delivered,
      this.deliveredAt,
      this.createdAt,
      status,
    );
  }
}
