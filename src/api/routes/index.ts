import { Connection } from 'mongoose';
import { Express } from 'express';

import { getAccountRouter } from './account.routes';
import { getCommentRouter } from './comment.routes';
import { getPostRouter } from './post.routes';

import { getAccountHeaderMiddleware } from '../middlewares';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';
import getDAOFactory from '../database/daoFactory';

export function setupRoutes(app: Express, connection: Connection): void {
    const daoFactory = getDAOFactory(connection);
    const acountHeaderMiddleware: AccountHeaderMiddleware = getAccountHeaderMiddleware(daoFactory.getAccountDAO());

    app.use('/accounts', getAccountRouter(daoFactory.getAccountDAO()));
    app.use('/posts', getPostRouter(daoFactory.getPostDAO(), acountHeaderMiddleware));
    app.use('/comments', getCommentRouter(daoFactory.getCommentDAO(), daoFactory.getPostDAO(), acountHeaderMiddleware));
}