import mongoose, { Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Comment } from './comment.model';
import { PostDocument } from '../../interfaces';
import { removeImage } from '../../helpers';

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    creator: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    numComments: { type: Number, index: true }
}, { timestamps: true });

PostSchema.plugin(mongoosePaginate);

PostSchema.pre<Query<PostDocument, PostDocument>>('deleteMany', async function() {
    const post = await this.model.findOne(this.getFilter());

    await Comment.deleteMany({ _id: { $in: post.comments }});
    await removeImage(post.image);
});

export const Post = mongoose.model<PostDocument>("Post", PostSchema);