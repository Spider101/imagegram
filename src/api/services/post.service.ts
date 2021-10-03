import { Post } from '../database/models';
import { getImageStoragePath } from '../helpers';
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