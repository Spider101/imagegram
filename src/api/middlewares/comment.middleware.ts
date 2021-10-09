import { Connection, isValidObjectId } from 'mongoose';

import { PostIdHeaderMiddleware } from '../interfaces/middleware.interface';
import { PostDocument } from '../interfaces/post';
import { HEADERS } from '../../config/constants';

export function getPostIdHeaderMiddleware(connection: Connection): PostIdHeaderMiddleware {
    return {
        requirePostIdHeader: async (req, res, next) => {
            const postId = req.header(HEADERS.postId);

            if (postId && isValidObjectId(postId)) {
                const doesPostExist = await connection.model<PostDocument>('Post').exists({ _id: postId });
                if (doesPostExist) {
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