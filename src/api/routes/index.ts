import { Connection } from 'mongoose';
import { Express } from 'express';

import { getAccountRouter } from './account.routes';
import { getCommentRouter } from './comment.routes';
import { getPostRouter } from './post.routes';

export function setupRoutes(app: Express, connection: Connection): void {
    app.use('/accounts', getAccountRouter(connection));
    app.use('/posts', getPostRouter(connection));
    app.use('/comments', getCommentRouter(connection));
}