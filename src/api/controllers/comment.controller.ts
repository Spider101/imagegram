import { Request, Response } from "express";
import { createComment } from '../services';
import { LOG, HEADERS } from '../../config';

export async function createCommentHandler(req: Request, res: Response) {
    const accountId = req.header(HEADERS.accountId);
    const postId = req.header(HEADERS.postId);
    LOG.info(`User with accountId: ${accountId} created comment on post with ID: ${postId}`);

    const createdComment = await createComment({
        ...req.body,
        creator: accountId,
        postId
    });

    return res.send(createdComment);
}