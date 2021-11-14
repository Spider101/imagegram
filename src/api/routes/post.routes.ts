import express, { NextFunction, Request, Response, Router } from 'express';

import { getPostService } from '../services';
import { getPostController } from '../controllers';

import { IPostDAO, IPostController, PostService } from '../interfaces/post';
import { saveImageToDisk, uploadImage } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';
import apiError from '../errors';

export function getPostRouter(postDAO: IPostDAO, accountHeaderMiddleware: AccountHeaderMiddleware): Router {
    const postRouter: Router = express.Router();

    const postService: PostService = getPostService(postDAO);
    const postController: IPostController = getPostController(postService);

    const useWithPromiseRejection =
        (fn: IPostController['fetchAllPostsHandler']) => (req: Request, res: Response, next: NextFunction) =>
            Promise.resolve(fn(req, res, next)).catch((error: Error) => next(apiError.internal(error.message)));

    postRouter.get(
        '/',
        accountHeaderMiddleware.requireAccountHeader,
        useWithPromiseRejection(postController.fetchAllPostsHandler)
    );
    postRouter.post(
        '/',
        [accountHeaderMiddleware.requireAccountHeader, uploadImage(), saveImageToDisk],
        postController.createPostHandler
    );

    return postRouter;
}