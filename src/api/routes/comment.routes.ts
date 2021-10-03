import express from 'express';
import { createCommentHandler } from '../controllers';
import { requireAccountHeader, requirePostIdHeader } from '../middlewares';

const commentRouter = express.Router();

commentRouter.post('/', [requireAccountHeader, requirePostIdHeader], createCommentHandler);

export default commentRouter;