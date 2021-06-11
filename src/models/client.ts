import logger from '@src/logger';
import AuthService from '@src/services/auth';
import mongoose, { Document, Model } from 'mongoose';

export interface Client {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
}

interface ClientModel extends Omit<Client, '_id'>, Document { }

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
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

/**
 * Validates the email and throws a validation error, otherwise it will throw a 500
 */
schema.path('email').validate(
    async (email: string) => {
        const emailCount = await mongoose.models.Clients.countDocuments({ email });
        return !emailCount;
    },
    'already exists in the database.',
    CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<ClientModel>('save', async function (): Promise<void> {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        const hashedPassword = await AuthService.hashPassword(this.password);
        this.password = hashedPassword;
    } catch (err) {
        logger.error(`Error hashing the password for the client ${this.name}`);
    }

});

export const Client: Model<ClientModel> = mongoose.model('Clients', schema);