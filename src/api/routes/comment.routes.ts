import express, { Router } from 'express';
import { Connection, Model, Schema } from 'mongoose';

import getModel from '../database/modelFactory';
import buildSchema from '../database/schemas/comment.schema';

import { getCommentController } from '../controllers';
import { getCommentService } from '../services';

import { AccountHeaderMiddleware, PostIdHeaderMiddleware } from '../interfaces/middleware.interface';
import { CommentController, CommentDocument, CommentService } from '../interfaces/comment';
import { getPostIdHeaderMiddleware } from '../middlewares';
import { IPostDAO } from '../database/dao';

export function getCommentRouter(
    connection: Connection,
    postDAO: IPostDAO,
    accountHeaderMiddleware: AccountHeaderMiddleware
): Router {
    const postIdHeaderMiddleware: PostIdHeaderMiddleware = getPostIdHeaderMiddleware(postDAO);
    const commentRouter: Router = express.Router();

    const commentSchema: Schema = buildSchema(connection);
    const commentModel: Model<CommentDocument> = getModel<CommentDocument>(connection, 'Comment', commentSchema);
    const commentService: CommentService = getCommentService(commentModel);
    const commentController: CommentController = getCommentController(commentService);

    commentRouter.post(
        '/',
        [accountHeaderMiddleware.requireAccountHeader, postIdHeaderMiddleware.requirePostIdHeader],
        commentController.createCommentHandler
    );

    return commentRouter;
}