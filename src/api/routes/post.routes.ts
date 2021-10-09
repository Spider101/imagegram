import express, { Router } from 'express';
import { Connection, Model, Schema } from 'mongoose';

import getModel from '../database/modelFactory';
import buildSchema from '../database/schemas/post.schema';

import { getPostService } from '../services';
import { getPostController } from '../controllers';

import { PostController, PostDocument, PostService } from '../interfaces/post';
import { requireAccountHeader, uploadImage } from '../middlewares';

export function getPostRouter(connection: Connection): Router {
    const postRouter: Router = express.Router();

    const postSchema: Schema = buildSchema(connection);
    const postModel: Model<PostDocument> = getModel<PostDocument>(connection, 'Post', postSchema);
    const postService: PostService = getPostService(postModel);
    const postController: PostController = getPostController(postService);

    postRouter.get('/', requireAccountHeader, postController.fetchAllPostsHandler);
    postRouter.post('/', [uploadImage(), requireAccountHeader], postController.createPostHandler);

    return postRouter;
}