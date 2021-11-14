import express, { Express, Request, Response } from 'express';
import { Connection } from 'mongoose';

import { LOG } from '../config';
import { HealthCheck } from './interfaces/healthcheck.interface';
import { getErrorHandlingMiddleware } from './middlewares';
import { setupRoutes } from './routes';

export default function buildApplication(connection: Connection): Express {
    const app: Express = express();

    app.use(express.json());

    // register health check endpoint
    app.get('/healthcheck', (req: Request, res: Response): void => {
        LOG.info('Checking if service is healthy...');

        const healthcheck: HealthCheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };

        res.send(healthcheck);
    });

    // register other routes
    setupRoutes(app, connection);

    app.use(getErrorHandlingMiddleware().handleErrors);

    return app;
}