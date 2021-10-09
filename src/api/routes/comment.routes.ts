import express, { Router } from 'express';
import { Connection, Model, Schema } from 'mongoose';

import getModel from '../database/modelFactory';
import buildSchema from '../database/schemas/comment.schema';

import { getCommentController } from '../controllers';
import { getCommentService } from '../services';

import { CommentController, CommentDocument, CommentService } from '../interfaces/comment';
import { requireAccountHeader, requirePostIdHeader } from '../middlewares';

export function getCommentRouter(connection: Connection): Router {
    const commentRouter: Router = express.Router();

    const commentSchema: Schema = buildSchema(connection);
    const commentModel: Model<CommentDocument> = getModel<CommentDocument>(connection, 'Comment', commentSchema);
    const commentService: CommentService = getCommentService(commentModel);
    const commentController: CommentController = getCommentController(commentService);

    commentRouter.post('/', [requireAccountHeader, requirePostIdHeader], commentController.createCommentHandler);

    return commentRouter;
}