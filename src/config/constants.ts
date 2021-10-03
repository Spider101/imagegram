import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost' as string;
const SERVER_PORT = process.env.SERVER_PORT || 3001 as number;
const SERVER_STORAGE_PATH = process.env.PATH_TO_UPLOADS || './uploads' as string;

export const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    storagePath: SERVER_STORAGE_PATH
};

const DB_PASSWORD = process.env.MONGODB_PASSWORD as string;
const DB_NAME = process.env.MONGODB_DBNAME as string;
const REMOTE_DB_URI = `mongodb+srv://adminUser:${DB_PASSWORD}@imagegram.8tj6w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority` as string;

export const DB = {
    uri: process.env.LOCAL_MONGO_URL || REMOTE_DB_URI as string
};

export const HEADERS = {
    accountId: 'X-Account-Id',
    postId: 'Post-Id',
    authResponseKey: 'WWW-authenticate'
};

export const ENV = {
    isDevelopment: (): boolean => process.env.ENV === 'development',
    isProduction: (): boolean => process.env.ENV === 'production'
};