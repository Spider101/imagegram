import { PaginateResult } from 'mongoose';
import { PostDocument } from './document.interface';

interface PostParams {
    caption: PostDocument['caption'];
    creator: PostDocument['creator'];
}

export interface PostService {
    createPost(postParams: PostParams, file: Express.Multer.File): Promise<PostDocument>;
    fetchAllPosts(page: string, size: string): Promise<PaginateResult<PostDocument>>;
}