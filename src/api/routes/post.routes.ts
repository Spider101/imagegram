import express from "express";
import { createPostHandler } from "../controllers";
import { requireAccountHeader, uploadImage } from "../middlewares";

const postRouter = express.Router();

postRouter.post('/', [uploadImage(), requireAccountHeader], createPostHandler);

export default postRouter;