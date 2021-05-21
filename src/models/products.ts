import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Product {
    _id?: string;
    code: string;
    barcode: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    fields: [{
        title: string,
        value: string,
    }]
}

const colorValidator = (v: any) => (/^#([0-9a-f]{3}){1,2}$/i).test(v)

const schema = new mongoose.Schema(
    {
        code: { type: String, required: true },
        barcode: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [String],
        colors: [{
            type: String,
            validate: [colorValidator, 'Not a HEX color']
        }],
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

interface ProductModel extends Omit<Product, '_id'>, Document { }
export const Product: Model<ProductModel> = mongoose.model('Products', schema);