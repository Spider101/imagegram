import { isValidObjectId } from 'mongoose';

import { PostIdHeaderMiddleware } from '../interfaces/middleware.interface';
import { HEADERS } from '../../config/constants';
import { IPostDAO } from '../database/dao';

export function getPostIdHeaderMiddleware(postDAO: IPostDAO): PostIdHeaderMiddleware {
    return {
        requirePostIdHeader: async (req, res, next) => {
            const postId = req.header(HEADERS.postId);

            if (postId && isValidObjectId(postId)) {
                if (await postDAO.doesPostExist(postId)) {
                    return next();
                } else {
                    res.status(404).json({ message: `No Post with ID: ${postId} found to add comment to!` });
                }
            } else {
                res.status(400).json({ message: `Incorrect or missing header for ${HEADERS.postId}` });
            }
        }
    };
}