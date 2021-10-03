import express from "express";
import { createPostHandler } from "../controllers";
import { requireAccountHeader } from "../middlewares";

const postRouter = express.Router();

postRouter.post('/', requireAccountHeader, createPostHandler);

export default postRouter;
