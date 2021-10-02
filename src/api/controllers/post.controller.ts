import { LOG, HEADERS } from '../../config';
import { Request, Response } from "express";
import { createPost } from '../services';

export async function createPostHandler(req: Request, res: Response) {
    const accountId = req.header(HEADERS.accountId);
    LOG.info(`Creating post for user with accountId: ${accountId}`);

    const createdPost = await createPost({
        ...req.body,
        creator: accountId
    });

    return res.send(createdPost);
}