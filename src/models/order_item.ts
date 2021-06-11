import mongoose, { Document, Model, Schema } from 'mongoose';

export interface OrderItem {
    _id?: string;
    product: string;
    fabric: string;
    quantity: number;
    valueItem: number;
    amount: number;
    active: boolean;
}

const schema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        fabric: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fabrics',
            required: true
        },
        quantity: { type: Number, default: 0 },
        valueItem: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
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

interface OrderItemModel extends Omit<OrderItem, '_id'>, Document { }
export const OrderItem: Model<OrderItemModel> = mongoose.model('OrderItems', schema);