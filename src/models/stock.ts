import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Stock {
    _id?: string;
    product: string;
    quantity: string;
    reserved: string;
    active: boolean;
    warehouse: string;
}

const schema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        reserved: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        },
        warehouse: {
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

interface StockModel extends Omit<Stock, '_id'>, Document { }
export const Stock: Model<StockModel> = mongoose.model('Stock', schema);