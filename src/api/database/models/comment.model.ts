import { Post } from './post.model';
import mongoose from 'mongoose';

import { CommentDocument } from '../../interfaces';

export const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    creator: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
}, { timestamps: true });

CommentSchema.post('save', async function(doc: CommentDocument) {
    await Post.findOneAndUpdate(
        { _id: doc.postId },
        { $push: { comments: doc._id } }
    );
});

export const Comment = mongoose.model<CommentDocument>("Comment", CommentSchema);