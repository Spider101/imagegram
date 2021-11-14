import { LOG, HEADERS } from '../../config';

import { PostService, IPostController } from '../interfaces/post';
import apiError from '../errors';

export function getPostController(postService: PostService): IPostController {
    return {
        createPostHandler: async (req, res, next) => {
            const accountId = req.header(HEADERS.accountId);
            LOG.info(`Creating post for user with accountId: ${accountId}`);

            if (req.file) {
                const createdPost = await postService.createPost(
                    {
                        caption: req.body.caption,
                        creator: accountId as string
                    },
                    req.file
                );

                return res.status(201).send(createdPost);
            } else {
                // only reason req.file is falsy is if the file type did not match the filter
                next(apiError.unprocessable('Incorrect file type used! Allowed types include .jpg, .png and .bmp'));
            }
        },
        fetchAllPostsHandler: async (req, res, _next) => {
            LOG.info('Fetching all posts...');

            const pageNum = req.query.page as string;
            const size = req.query.size as string;

            try {
                const { totalDocs, docs, totalPages, page } = await postService.fetchAllPosts(pageNum, size);

                return res.send({
                    totalItems: totalDocs,
                    posts: docs,
                    totalPages,
                    currentPage: page ? page - 1 : parseInt(pageNum)
                });
            } catch (error: unknown) {
                let errorMessage = '' as string;
                if (typeof error === 'string') {
                    errorMessage = error.toUpperCase();
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }
                return res.status(500).send({
                    message: errorMessage
                });
            }
        }
    };
}