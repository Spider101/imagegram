import express, { Router } from 'express';

import { getPostService } from '../services';
import { getPostController } from '../controllers';

import { IPostDAO, PostController, PostService } from '../interfaces/post';
import { saveImageToDisk, uploadImage } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';

export function getPostRouter(postDAO: IPostDAO, accountHeaderMiddleware: AccountHeaderMiddleware): Router {
    const postRouter: Router = express.Router();

    const postService: PostService = getPostService(postDAO);
    const postController: PostController = getPostController(postService);

    postRouter.get('/', accountHeaderMiddleware.requireAccountHeader, postController.fetchAllPostsHandler);
    postRouter.post(
        '/',
        [accountHeaderMiddleware.requireAccountHeader, uploadImage(), saveImageToDisk],
        postController.createPostHandler
    );

    return postRouter;
}