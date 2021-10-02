import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3001;

export const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const DB_PASSWORD = process.env.MONGODB_PASSWORD;
const DB_NAME = 'Imagegram';

export const DB = {
    uri: `mongodb+srv://adminUser:${DB_PASSWORD}@imagegram.8tj6w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
}