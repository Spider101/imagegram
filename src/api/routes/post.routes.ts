import express, { Router } from 'express';
import { Connection, Model, Schema } from 'mongoose';

import getModel from '../database/modelFactory';
import buildSchema from '../database/schemas/post.schema';

import { getPostService } from '../services';
import { getPostController } from '../controllers';

import { PostController, PostDocument, PostService } from '../interfaces/post';
import { uploadImage } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';

export function getPostRouter(connection: Connection, accountHeaderMiddleware: AccountHeaderMiddleware): Router {
    const postRouter: Router = express.Router();

    const postSchema: Schema = buildSchema(connection);
    const postModel: Model<PostDocument> = getModel<PostDocument>(connection, 'Post', postSchema);
    const postService: PostService = getPostService(postModel);
    const postController: PostController = getPostController(postService);

    postRouter.get('/', accountHeaderMiddleware.requireAccountHeader, postController.fetchAllPostsHandler);
    postRouter.post(
        '/',
        [accountHeaderMiddleware.requireAccountHeader, uploadImage()],
        postController.createPostHandler
    );

    return postRouter;
}