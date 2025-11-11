import mongoose, { Schema, Document } from "mongoose";

export interface IUnreadCount extends Document {
  userId: string;
  conversationWith: string;
  count: number;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const unreadCountSchema = new Schema<IUnreadCount>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    conversationWith: {
      type: String,
      required: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastMessageAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique conversation pairs and fast queries
unreadCountSchema.index({ userId: 1, conversationWith: 1 }, { unique: true });

// Index for efficient queries by user
unreadCountSchema.index({ userId: 1, count: 1 });

export const UnreadCountModel = mongoose.model<IUnreadCount>(
  "UnreadCount",
  unreadCountSchema
);
