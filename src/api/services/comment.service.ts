import { DocumentDefinition } from 'mongoose';
import { CommentDocument } from '../interfaces/comment.interface';
import { Comment } from '../database/models';

export async function createComment(comment: DocumentDefinition<CommentDocument>) {
    return await Comment.create(comment);
}