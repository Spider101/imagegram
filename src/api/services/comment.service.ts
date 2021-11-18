import { CommentService, ICommentDAO } from '../interfaces/comment';

export function getCommentService(commentDAO: ICommentDAO): CommentService {
    return {
        createComment: async comment => await commentDAO.createNewComment(comment)
    };
}