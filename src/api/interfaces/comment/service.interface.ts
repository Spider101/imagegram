import { DocumentDefinition } from 'mongoose';
import { CommentDocument } from './document.interface';

export interface CommentService {
    createComment(comment: DocumentDefinition<CommentDocument>): Promise<CommentDocument>;
}