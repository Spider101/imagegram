import { Connection, Model } from 'mongoose';

import { AccountDocument } from '../api/interfaces/account';
import { PostDocument } from '../api/interfaces/post';

export interface MongoTestDAO {
    getAccountIdFromDb(accountName: string): Promise<string>;
    getPostIdFromDb(accountId: string): Promise<string>;
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

export function getMongoTestDAO(connection: Connection): MongoTestDAO {
    const accountModel: Model<AccountDocument> = connection.model<AccountDocument>('Account');
    const postModel: Model<PostDocument> = connection.model<PostDocument>('Post');
    return {
        getAccountIdFromDb: async accountName => {
            const account = await accountModel.findOne({ name: accountName });
            if (account == null) {
                const newAccount = await getNewAccount(accountModel, accountName);
                return newAccount._id;
            }
            return account._id;
        },
        getPostIdFromDb: async accountId => {
            const post = await postModel.findOne({ creator: accountId });
            if (post == null) {
                const newPost = await getNewPost(postModel, accountId);
                return newPost._id;
            }
            return post._id;
        }
    };
}