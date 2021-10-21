import { LOG, HEADERS } from '../../config';

import { CommentController, CommentService } from '../interfaces/comment';

export function getCommentController(commentService: CommentService): CommentController {
    return {
        createCommentHandler: async (req, res) => {
            const accountId = req.header(HEADERS.accountId);
            const postId = req.header(HEADERS.postId);

            const createdComment = await commentService.createComment({
                ...req.body,
                creator: accountId,
                postId
            });
            LOG.info(`User with accountId: ${accountId} created comment on post with ID: ${postId}`);

            return res.status(201).send(createdComment);
        }
    };
}