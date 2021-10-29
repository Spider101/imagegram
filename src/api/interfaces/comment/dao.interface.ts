import { DocumentDefinition } from 'mongoose';

import { CommentDocument } from '.';

export interface ICommentDAO {
    createNewComment(comment: DocumentDefinition<CommentDocument>): Promise<CommentDocument>;
}