import { PaginateResult } from 'mongoose';
import { Post } from '../database/models';
import { getImageStoragePath, getPagination } from '../helpers';
import { PostDocument } from '../interfaces';

export async function createPost({
    caption,
    creator
}: {
    caption: PostDocument["caption"],
    creator: PostDocument["creator"],
}, file: Express.Multer.File) {
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
            options: { limit: 2 }
        },
        offset,
        limit,
        lean: true
    };

    try {
        return await Post.paginate(condition, options);
    } catch(error: any) {
        throw new Error(error);
    }
}