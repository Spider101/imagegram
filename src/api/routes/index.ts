import { Connection } from 'mongoose';
import { Express } from 'express';

import { getAccountRouter } from './account.routes';
import { getCommentRouter } from './comment.routes';
import { getPostRouter } from './post.routes';

import { getAccountHeaderMiddleware } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';

export function setupRoutes(app: Express, connection: Connection): void {
    const acountHeaderMiddleware: AccountHeaderMiddleware = getAccountHeaderMiddleware(connection);

    app.use('/accounts', getAccountRouter(connection));
    app.use('/posts', getPostRouter(connection, acountHeaderMiddleware));
    app.use('/comments', getCommentRouter(connection, acountHeaderMiddleware));
}