import { CommentSchema } from './comment.model';
import { PostDocument } from '../../interfaces';
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    creator: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", PostSchema);