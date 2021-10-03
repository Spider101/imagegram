import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { PostDocument } from '../../interfaces';

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    creator: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

PostSchema.plugin(mongoosePaginate);

export const Post = mongoose.model<PostDocument>("Post", PostSchema);