import mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    { timestamps: true }
);