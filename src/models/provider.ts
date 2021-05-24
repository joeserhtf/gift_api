import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Provider {
    _id?: string;
    name: string;
    email: string;
    contact: string;
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        contact: {
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

interface ProviderModel extends Omit<Provider, '_id'>, Document { }
export const Provider: Model<ProviderModel> = mongoose.model('Providers', schema);