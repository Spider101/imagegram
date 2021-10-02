import { LOG } from './../../config/logger';
import { DB } from "../../config";
import mongoose from 'mongoose';

export default function() {
    const dbURI = DB.uri as string;

    return mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => LOG.info('Connected to MongoDB database...'))
    .catch((err) => {
        LOG.error('Unable to connect to MongoDB database. Shutting down...');
        LOG.error('DB error:', err);
        process.exit(1);
    })
}