import { PaginateResult } from 'mongoose';

import { Post } from '../database/models';
import { getImageStoragePath, getPagination } from '../helpers';
import { PostDocument } from '../interfaces';

export async function createPost({
    caption,
    creator
}: {
    caption: PostDocument['caption'],
    creator: PostDocument['creator'],
}, file: Express.Multer.File): Promise<PostDocument> {
    return await Post.create({
        caption,
        creator,
        image: getImageStoragePath(file)
    });
}

export async function fetchAllPosts(page: string, size: string): Promise<PaginateResult<PostDocument>> {
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
        return await Post.paginate(condition, options);
    } catch(error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error.toUpperCase() : 'Something went wrong while fetching all posts!';
        throw new Error(errorMessage);
    }
}