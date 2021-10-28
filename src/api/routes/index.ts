import { Connection, Schema } from 'mongoose';
import { Express } from 'express';

import { getAccountRouter } from './account.routes';
import { getCommentRouter } from './comment.routes';
import { getPostRouter } from './post.routes';

import { getAccountHeaderMiddleware } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';
import { AccountDAO, getAccountDAO } from '../database';
import buildSchema from '../database/schemas/account.schema';

export function setupRoutes(app: Express, connection: Connection): void {
    const accountSchema: Schema = buildSchema(connection);
    const accountDAO: AccountDAO = getAccountDAO(connection, accountSchema);
    const acountHeaderMiddleware: AccountHeaderMiddleware = getAccountHeaderMiddleware(accountDAO);

    app.use('/accounts', getAccountRouter(connection));
    app.use('/posts', getPostRouter(connection, acountHeaderMiddleware));
    app.use('/comments', getCommentRouter(connection, acountHeaderMiddleware));
}