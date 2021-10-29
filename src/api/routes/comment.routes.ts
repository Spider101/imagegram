import express, { Router } from 'express';

import { getCommentController } from '../controllers';
import { getCommentService } from '../services';

import { AccountHeaderMiddleware, PostIdHeaderMiddleware } from '../interfaces/middleware.interface';
import { CommentController, CommentService } from '../interfaces/comment';
import { IPostDAO } from '../interfaces/post';
import { getPostIdHeaderMiddleware } from '../middlewares';

import { ICommentDAO } from '../database/dao/comment.dao';

export function getCommentRouter(
    commentDAO: ICommentDAO,
    postDAO: IPostDAO,
    accountHeaderMiddleware: AccountHeaderMiddleware
): Router {
    const postIdHeaderMiddleware: PostIdHeaderMiddleware = getPostIdHeaderMiddleware(postDAO);
    const commentRouter: Router = express.Router();

    const commentService: CommentService = getCommentService(commentDAO);
    const commentController: CommentController = getCommentController(commentService);

    commentRouter.post(
        '/',
        [accountHeaderMiddleware.requireAccountHeader, postIdHeaderMiddleware.requirePostIdHeader],
        commentController.createCommentHandler
    );

    return commentRouter;
}