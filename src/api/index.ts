import { Connection } from 'mongoose';
import { Express } from 'express';

import getDbConnection from './database/connect';
import buildApplication from './app';

import { DB, LOG, SERVER } from '../config';

const connection: Connection = getDbConnection(DB.uri);
const app: Express = buildApplication(connection);

app.listen(SERVER.port, () => {
    LOG.info(`Listening on port: ${SERVER.port}`);
});