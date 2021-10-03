import express, { Request, Response } from 'express';

import { LOG, SERVER } from '../config';
import connect from './database/connect';
import { HealthCheck } from './interfaces';
import { setupRoutes } from './routes';

const app = express();

app.use(express.json());

app.get('/healthcheck', (_req: Request, res: Response) => {
    LOG.info('Checking if service is healthy...');

    const healthcheck: HealthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };

    res.send(healthcheck);
});

app.listen(SERVER.port, () => {
    LOG.info(`Listening on port: ${SERVER.port}`);

    // connect to the database
    connect();

    // setup the routes
    setupRoutes(app);
});