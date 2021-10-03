import mongoose from 'mongoose';

export interface AccountDocument extends mongoose.Document {
    name: string
}