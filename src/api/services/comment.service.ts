import { CommentService } from '../interfaces/comment';
import { ICommentDAO } from '../database/dao/comment.dao';

export function getCommentService(commentDAO: ICommentDAO): CommentService {
    return {
        createComment: async comment => await commentDAO.createNewComment(comment)
    };
}