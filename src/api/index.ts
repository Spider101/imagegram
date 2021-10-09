import getDbConnection from './database/connect';

import buildApplication from './app';
import { DB, LOG, SERVER } from '../config';

const connection = getDbConnection(DB.uri);
const app = buildApplication(connection);

app.listen(SERVER.port, () => {
    LOG.info(`Listening on port: ${SERVER.port}`);
});