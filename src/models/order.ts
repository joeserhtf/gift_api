import mongoose, { Document, Model, Schema } from 'mongoose';
import logger from '@src/logger';
import Randomstring from 'randomstring';

export interface Order {
    _id?: string;
    orderId: string;
    client: string;
    clientAdress: string;
    shippingFee: string;
    discount: number;
    voucher: string;
    bruteValue: number;
    amount: number;
    paymentForm: string;
    status: string;
    tracking: string;
    note: string;
    items: string[];
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema(
    {
        orderId: { type: String, unique: true },
        amount: { type: Number, required: true },
        bruteValue: { type: Number, required: true },
        shippingFee: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        voucher: { type: String },
        paymentForm: { type: String },
        note: { type: String },
        status: {
            type: String,
            default: "Basket"
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clients'
        },
        clientAdress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClientAddress'
        },
        tracking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trackings'
        },
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItems'
        }]
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

schema.pre<OrderModel>('save', async function (): Promise<void> {
    try {

        console.log(this.orderId);

        if (!this.status) this.status = "60c3443a25e43d3a18e9beaa"; //Basic Basket Status

        if (this.orderId == '' || !this.orderId) {

            let isvalid = false;

            while (!isvalid) {
                const randomString = Date.now() + Randomstring.generate({
                    length: 4,
                    charset: 'numeric'
                });

                console.log(randomString);

                var order = randomString.substring(9);

                console.log(order);

                const orderIdCheck = await mongoose.models.Orders.countDocuments({
                    orderId: order
                });

                if (!orderIdCheck) {
                    this.orderId = order;
                    isvalid = true;
                }
            }
        }
    } catch (err) {
        logger.error(`Error creating orderID ${err}`);
    }
});

interface OrderModel extends Omit<Order, '_id'>, Document { }
export const Order: Model<OrderModel> = mongoose.model('Orders', schema);