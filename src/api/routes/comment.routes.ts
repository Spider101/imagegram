import express from "express";
import { createCommentHandler } from "../controllers";
import { requireAccountHeader } from "../middlewares";

const commentRouter = express.Router();

commentRouter.post('/', requireAccountHeader, createCommentHandler);

export default commentRouter;