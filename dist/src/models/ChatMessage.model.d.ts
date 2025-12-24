import mongoose, { Document } from 'mongoose';
export declare enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    FILE = "FILE"
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
declare const _default: mongoose.Model<IChatMessage, {}, {}, {}, mongoose.Document<unknown, {}, IChatMessage, {}, mongoose.DefaultSchemaOptions> & IChatMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IChatMessage>;
export default _default;
//# sourceMappingURL=ChatMessage.model.d.ts.map