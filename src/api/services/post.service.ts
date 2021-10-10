import { PaginateModel } from 'mongoose';

import { getImageStoragePath, getPagination } from '../helpers';
import { PostDocument, PostService } from '../interfaces/post';

export function getPostService(postModel: PaginateModel<PostDocument>): PostService {
    return {
        createPost: async ({ caption, creator }, file) =>
            await postModel.create({ caption, creator, image: getImageStoragePath(file) }),
        fetchAllPosts: async (page, size) => {
            const condition = {};
            const { offset, limit } = getPagination(size, page);

            const options = {
                populate: {
                    path: 'comments',
                    options: {
                        sort: { createdAt: -1 },
                        perDocumentLimit: 2
                    }
                },
                offset,
                limit,
                sort: { numComments: -1 }
            };

            try {
                return postModel.paginate(condition, options);
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : typeof error === 'string'
                        ? error.toUpperCase()
                        : 'Something went wrong while fetching all posts!';
                throw new Error(errorMessage);
            }
        }
    };
}