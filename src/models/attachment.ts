import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Attachment {
    _id?: string;
    name: string;
    url: string;
    type: string;
    path: string;
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        type: {
            type: String
        },
        pah: {
            type: String
        },
        record: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Record',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

interface AttachmentModel extends Omit<Attachment, '_id'>, Document { }
export const Attachment: Model<AttachmentModel> = mongoose.model('Attachment', schema);