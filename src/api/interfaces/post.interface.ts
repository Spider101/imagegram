import mongoose from 'mongoose';
import { CommentDocument } from './comment.interface';

export interface PostDocument extends mongoose.Document {
    caption: string,
    creator: string,
    image: string,
    comments: Array<string>,
    numComments: number
}