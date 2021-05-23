import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Product {
    _id?: string;
    code: string;
    barcode: string;
    description: string;
    price: number;
    sale: number;
    images: string[];
    colors: string[];
    fields: [{
        title: string,
        value: string,
    }]
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
  }

const colorValidator = (v: any) => (/^#([0-9a-f]{3}){1,2}$/i).test(v)

const schema = new mongoose.Schema(
    {
        barcode: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        sale: { type: Number, default: 0 },
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

 schema.path('barcode').validate(
    async (barcode: string) => {
      const barcodeCount = await mongoose.models.User.countDocuments({ barcode });
      return !barcodeCount;
    },
    'already exists in the database.',
    CUSTOM_VALIDATION.DUPLICATED
  );

interface ProductModel extends Omit<Product, '_id'>, Document { }
export const Product: Model<ProductModel> = mongoose.model('Products', schema);