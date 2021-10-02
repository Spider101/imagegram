import mongoose from 'mongoose';
import { CommentDocument } from './comment.interface';

export interface PostDocument extends mongoose.Document {
    caption: string,
    creator: string,
    comments: Array<CommentDocument>
}