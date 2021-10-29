import {
    FilterQuery, PaginateOptions,
    PaginateResult
} from 'mongoose';

import { PostDocument } from '.';

export interface IPostDAO {
    createNewPost(postCaption: string, postCreator: string, imageKey: string): Promise<PostDocument>;
    getPaginatedResults(
        query: FilterQuery<PostDocument>,
        options: PaginateOptions
    ): Promise<PaginateResult<PostDocument>>;
    doesPostExist(postId: string): Promise<boolean>;
}