import { Connection, Model, Schema } from 'mongoose';

import { CommentDocument, ICommentDAO } from '../../interfaces/comment';
import getModel from '../modelFactory';
import buildSchema from '../schemas/comment.schema';

export function getCommentDAO(connection: Connection): ICommentDAO {
    const commentSchema: Schema = buildSchema(connection);
    const commentModel: Model<CommentDocument> = getModel(connection, 'Comment', commentSchema);
    return {
        createNewComment: async comment => await commentModel.create(comment)
    };
}
