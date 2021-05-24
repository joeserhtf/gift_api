import mongoose, { Document, Model, Schema } from 'mongoose';

export interface WareHouse {
    _id?: string;
    name: string;
    size: string;
    active: string;
    city: string;
    contry: string;
    district: string;
    street: string;
    number: string;
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        size: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true        
        },
        city: {
            type: String,
        },
        contry: {
            type: String,
        },
        district: {
            type: String,
        },
        street: {
            type: String,
        },
        number: {
            type: String,
        },
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

interface WareHouseModel extends Omit<WareHouse, '_id'>, Document { }
export const WareHouse: Model<WareHouseModel> = mongoose.model('WareHouse', schema);