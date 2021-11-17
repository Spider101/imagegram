import { getImageStoragePath, getPagination } from '../helpers';
import { IPostDAO, PostService } from '../interfaces/post';

export function getPostService(postDAO: IPostDAO): PostService {
    return {
        createPost: async ({ caption, creator }, file) =>
            await postDAO.createNewPost(caption, creator, getImageStoragePath(file)),
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

            return await postDAO.getPaginatedResults(condition, options);
        }
    };
}