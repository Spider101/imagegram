import mongoose, { Query } from 'mongoose';

import { Post } from './post.model';
import { Comment } from './comment.model';
import { AccountDocument } from '../../interfaces';

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamps: true });

AccountSchema.pre<Query<AccountDocument, AccountDocument>>('deleteOne', async function() {
    const account = await this.model.findOne(this.getFilter());

    await Post.deleteMany({ creator: account._id });
    await Comment.deleteMany({ creator: account._id });
});

export const Account = mongoose.model<AccountDocument>("Account", AccountSchema);