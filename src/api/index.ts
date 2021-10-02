import express from 'express';
import { LOG, SERVER } from '../config';
import connect from './database/connect';

const app = express();

app.get('/healthcheck', (_req, res) => {
    LOG.info('Checking if service is healthy...');
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    }
    res.send(healthcheck);
});

app.listen(SERVER.port, () => {
    LOG.info(`Listening on port: ${SERVER.port}`);

    connect();
});