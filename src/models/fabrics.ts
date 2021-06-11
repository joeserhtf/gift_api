import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Fabric {
    _id?: string;
    name: string;
    provider: string;
    stocks: string[];
    factor: number;
    sale: number;
    images: string[];
    fields: [{
        title: string,
        value: string,
    }]
}

const schema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
            required: true
        },
        stocks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock'
        }],
        factor: {
            type: Number,
            default: 1
        },
        sale: {
            type: Number,
            default: 0 
        },
        images: [String],
        fields: [{
            title: { type: String, required: false },
            value: { type: String, required: false }
        }]
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

interface FabricModel extends Omit<Fabric, '_id'>, Document { }
export const Fabric: Model<FabricModel> = mongoose.model('Fabrics', schema);