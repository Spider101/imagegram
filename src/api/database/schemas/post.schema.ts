import mongoose, { Connection, Query, Schema } from 'mongoose';
import { removeImage } from '../../helpers';
import { PostDocument } from '../../interfaces';

export default function buildSchema(connection: Connection): Schema {
    const PostSchema = new mongoose.Schema(
        {
            caption: { type: String, required: true },
            creator: { type: String, required: true },
            image: { type: String, required: true },
            comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
            numComments: { type: Number, index: true }
        },
        { timestamps: true }
    );

    // register middleware
    PostSchema.pre<Query<PostDocument, PostDocument>>('deleteMany', async function () {
        const post = await this.model.findOne(this.getFilter());

        // delete all comments on post and remove associated image from storage
        await connection.model('Comment').deleteMany({ _id: { $in: post.comments } });
        await removeImage(post.image);
    });

    return PostSchema;
}
