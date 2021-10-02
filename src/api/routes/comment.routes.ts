import express from "express";
import { createCommentHandler } from "../controllers";

const commentRouter = express.Router();

commentRouter.post('/', createCommentHandler);

export default commentRouter;