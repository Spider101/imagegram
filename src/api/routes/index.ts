import { Express } from "express";

import accountRouter from "./account.routes";
import commentRouter from "./comment.routes";
import postRouter from "./post.routes";

export function setupRoutes(app: Express) {
    app.use('/account', accountRouter);
    app.use('/post', postRouter);
    app.use('/comment', commentRouter);
}