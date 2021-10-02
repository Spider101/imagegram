import { DocumentDefinition } from 'mongoose';
import { Post } from '../database/models';
import { PostDocument } from '../interfaces';

export async function createPost(post: DocumentDefinition<PostDocument>) {
    return await Post.create(post);
}