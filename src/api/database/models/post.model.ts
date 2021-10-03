import mongoose, { Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Comment } from './comment.model';
import { PostDocument } from '../../interfaces';

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    creator: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    numComments: { type: Number, index: true }
}, { timestamps: true });

PostSchema.plugin(mongoosePaginate);

PostSchema.pre<Query<PostDocument, PostDocument>>('deleteMany', async function() {
    const doc = await this.model.findOne(this.getFilter());

    await Comment.deleteMany({ _id: { $in: doc.comments }});
});

export const Post = mongoose.model<PostDocument>("Post", PostSchema);