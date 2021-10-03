import mongoose from 'mongoose';

export interface PostDocument extends mongoose.Document {
    caption: string,
    creator: string,
    image: string
}