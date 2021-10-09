import mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    creator: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });