import {
    Connection,
    FilterQuery,
    PaginateModel,
    PaginateOptions,
    PaginateResult,
    Schema
} from 'mongoose';

import { PostDocument } from '../../interfaces/post';
import getModel from '../modelFactory';
import buildSchema from '../schemas/post.schema';

export interface IPostDAO {
    createNewPost(postCaption: string, postCreator: string, imageKey: string): Promise<PostDocument>;
    getPaginatedResults(
        query: FilterQuery<PostDocument>,
        options: PaginateOptions
    ): Promise<PaginateResult<PostDocument>>;
    doesPostExist(postId: string): Promise<boolean>;
}

export function getPostDAO(connection: Connection): IPostDAO {
    const schema: Schema = buildSchema(connection);
    const postModel: PaginateModel<PostDocument> = getModel(connection, 'Post', schema) as PaginateModel<PostDocument>;
    return {
        createNewPost: async (postCaption, postCreator, imageKey) =>
            await postModel.create({ caption: postCaption, creator: postCreator, image: imageKey }),
        getPaginatedResults: async (query, options) => await postModel.paginate(query, options),
        doesPostExist: async postId => await postModel.exists({ _id: postId })
    };
}
