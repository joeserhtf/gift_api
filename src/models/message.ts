import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Message {
    _id?: string;
    chatId: number;
    text: string;
    from: string;
    to: string;
    way: string;
    classification: string;
}

const schema = new mongoose.Schema(
    {
        chatId: {
            type: Number,
        },
        text: {
            type: String,
        },
        from: {
            type: String,
        },
        to: {
            type: String,
        },
        way: {
            type: String,
        },
        classification: {
            type: String,
        },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

interface MessageModel extends Omit<Message, '_id'>, Document { }
export const Message: Model<MessageModel> = mongoose.model('Messages', schema);