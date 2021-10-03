import { Express } from 'express';

import accountRouter from './account.routes';
import commentRouter from './comment.routes';
import postRouter from './post.routes';

export function setupRoutes(app: Express): void {
    app.use('/accounts', accountRouter);
    app.use('/posts', postRouter);
    app.use('/comments', commentRouter);
}