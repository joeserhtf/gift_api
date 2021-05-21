import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Campaign {
    _id?: string;
    name: string;
    description: string;
    active: boolean;
    startDate: string;
    endDate: string;
    events: string[];
    users: string[];
    company: string;
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        events: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }],
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
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

interface CampaignModel extends Omit<Campaign, '_id'>, Document { }
export const Campaign: Model<CampaignModel> = mongoose.model('Campaign', schema);