import mongoose from 'mongoose';

export interface CommentDocument extends mongoose.Document {
    content: string,
    creator: string,
    postId: string
}