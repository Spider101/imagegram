import express from 'express';
import { createPostHandler, fetchAllPostsHandler } from '../controllers';
import { requireAccountHeader, uploadImage } from '../middlewares';

const postRouter = express.Router();

postRouter.get('/', requireAccountHeader, fetchAllPostsHandler);
postRouter.post('/', [uploadImage(), requireAccountHeader], createPostHandler);

export default postRouter;