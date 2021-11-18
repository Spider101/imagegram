import { isValidObjectId } from 'mongoose';

import { PostIdHeaderMiddleware } from '../interfaces/middleware.interface';
import { IPostDAO } from '../interfaces/post';
import { HEADERS } from '../../config/constants';
import apiError from '../errors';

export function getPostIdHeaderMiddleware(postDAO: IPostDAO): PostIdHeaderMiddleware {
    return {
        requirePostIdHeader: async (req, res, next) => {
            const postId = req.header(HEADERS.postId);

            if (postId && isValidObjectId(postId)) {
                if (await postDAO.doesPostExist(postId)) {
                    next();
                } else {
                    next(apiError.notFound(`No Post with ID: ${postId} found to add comment to!`));
                }
            } else {
                next(apiError.badRequest(`Incorrect or missing header for ${HEADERS.postId}`));
            }
        }
    };
}