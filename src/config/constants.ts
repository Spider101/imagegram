import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: path.resolve(__dirname, '..', '..', envFile) });

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost' as string;
const SERVER_PORT = process.env.SERVER_PORT || 3001 as number;
const SERVER_STORAGE_PATH = process.env.PATH_TO_UPLOADS || './uploads' as string;

export const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    storagePath: SERVER_STORAGE_PATH
};

// REMOTE_DB_URI would look like `mongodb+srv://adminUser:${DB_PASSWORD}@imagegram.8tj6w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
export const DB = {
    uri: process.env.REMOTE_DB_URI || 'mongodb://localhost:27017/test' as string
};

export const HEADERS = {
    accountId: 'X-Account-Id',
    postId: 'X-Post-Id',
    authResponseKey: 'WWW-authenticate'
};

export const ENV = {
    isDevelopment: (): boolean => process.env.ENV === 'development',
    isProduction: (): boolean => process.env.ENV === 'production'
};