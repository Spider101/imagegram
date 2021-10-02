import express from "express";
import { createPostHandler } from "../controllers";

const postRouter = express.Router();

postRouter.post('/', createPostHandler);

export default postRouter;
