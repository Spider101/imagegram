import { Express } from 'express';
import MongoMemoryServer from 'mongodb-memory-server-core';
import { Connection, Model } from 'mongoose';

import buildApplication from '../api/app';
import getDbConnection from '../api/database/connect';
import { AccountDocument } from '../api/interfaces/account';
import { PostDocument } from '../api/interfaces/post';
import { LOG } from '../config';

export interface MongoTestDAO {
    init(): Promise<Express>;
    getAccountIdFromDb(accountName: string): Promise<string>;
    getPostIdFromDb(accountId: string): Promise<string>;
    shutDown(): Promise<void>;
}

async function getNewAccount(accountModel: Model<AccountDocument>, accountName: string) {
    return await accountModel.create({ name: accountName });
}

async function getNewPost(postModel: Model<PostDocument>, accountId: string) {
    return await postModel.create({
        caption: 'fake post caption',
        creator: accountId,
        image: 'fake image key'
    });
}

export function getMongoTestDAO(): MongoTestDAO {
    let connection: Connection;
    let mongoServer: MongoMemoryServer;
    return {
        init: async () => {
            mongoServer = await MongoMemoryServer.create();
            const connectionString: string = mongoServer.getUri();
            LOG.info(
                `Started the mongo server for integration tests using ${connectionString} as the connection string`
            );

            connection = getDbConnection(connectionString);
            const app: Express = buildApplication(connection);
            return app;
        },
        getAccountIdFromDb: async accountName => {
            const accountModel: Model<AccountDocument> = connection.model<AccountDocument>('Account');
            const account = await accountModel.findOne({ name: accountName });
            if (account == null) {
                const newAccount = await getNewAccount(accountModel, accountName);
                return newAccount._id;
            }
            return account._id;
        },
        getPostIdFromDb: async accountId => {
            const postModel: Model<PostDocument> = connection.model<PostDocument>('Post');
            const post = await postModel.findOne({ creator: accountId });
            if (post == null) {
                const newPost = await getNewPost(postModel, accountId);
                return newPost._id;
            }
            return post._id;
        },
        shutDown: async () => {
            if (connection) {
                LOG.info('Shutting down mongoose connection...');
                await connection.close();
            }

            // stop the mongo server after all the tests finish running
            if (mongoServer) {
                LOG.info('Stopping mongo server for integration tests...');
                await mongoServer.stop();
            }
        }
    };
}