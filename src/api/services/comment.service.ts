import { Model } from 'mongoose';

import { CommentDocument, CommentService } from '../interfaces/comment';

export function getCommentService(commentModel: Model<CommentDocument>): CommentService {
    return {
        createComment: async comment => await commentModel.create(comment)
    }
}