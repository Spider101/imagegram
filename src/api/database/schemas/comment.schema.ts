import mongoose, { Connection, Schema } from 'mongoose';

import { CommentDocument } from '../../interfaces';

export default function buildSchema(connection: Connection): Schema {
    const CommentSchema = new mongoose.Schema(
        {
            content: { type: String, required: true },
            creator: { type: String, required: true },
            postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
        },
        { timestamps: true }
    );

    // register middleware
    CommentSchema.post('save', async function (comment: CommentDocument) {
        // find the associated post document and update it such that the new comment's id
        // is added to the comments property and the numComments property is incremented by one as well
        await connection.model('Post').findOneAndUpdate(
            { _id: comment.postId },
            {
                $push: { comments: comment._id },
                $inc: { numComments: 1 }
            }
        );
    });

    return CommentSchema;
}