// frontend/src/chat/domain/entities/Message.ts
export class Message {
  constructor(
    public readonly id: string,
    public readonly from: string,
    public readonly to: string,
    public readonly body: string,
    public readonly delivered: boolean,
    public readonly deliveredAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id: string;
    from: string;
    to: string;
    body: string;
    delivered: boolean;
    deliveredAt?: string;
    createdAt: string;
  }): Message {
    return new Message(
      data.id,
      data.from,
      data.to,
      data.body,
      data.delivered,
      data.deliveredAt ? new Date(data.deliveredAt) : null,
      new Date(data.createdAt),
    );
  }

  isFromMe(userId: string): boolean {
    return this.from === userId;
  }
}
