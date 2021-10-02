import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost' as string;
const SERVER_PORT = process.env.SERVER_PORT || 3001 as number;

export const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const DB_PASSWORD = process.env.MONGODB_PASSWORD as string;
const DB_NAME = process.env.MONGODB_DBNAME as string;

export const DB = {
    uri: `mongodb+srv://adminUser:${DB_PASSWORD}@imagegram.8tj6w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
};

export const HEADERS = {
    accountId: 'X-Account-Id',
    postId: 'Post-Id'
};