import mongoose, { Connection } from 'mongoose';

import { LOG } from '../../config';

export default function getDbConnection(connectionString: string): Connection {
    mongoose.set('useCreateIndex', true);

    LOG.info('Connecting to MongoDB database...');
    LOG.debug(`Connection string used: ${connectionString}`);
    return mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};