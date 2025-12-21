import mongoose, { Schema, Document } from 'mongoose';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  message: string;
  type: MessageType;
  fileUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT },
    fileUrl: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'chat_messages',
  }
);

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);


