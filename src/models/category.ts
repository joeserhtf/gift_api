import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Category {
    _id?: string;
    name: string;
    description: string;
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
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

interface CategoryModel extends Omit<Category, '_id'>, Document { }
export const Category: Model<CategoryModel> = mongoose.model('Categories', schema);