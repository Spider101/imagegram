import { Connection, Model } from 'mongoose';

import { AccountDocument } from '../api/interfaces/account';

export interface MongoTestDAO {
    getAccountIdFromDb(accountName: string): Promise<string>;
}

async function getNewAccount(accountModel: Model<AccountDocument>, accountName: string) {
    return await accountModel.create({ name: accountName });
}

export function getMongoTestDAO(connection: Connection): MongoTestDAO {
    const accountModel: Model<AccountDocument> = connection.model<AccountDocument>('Account');
    return {
        getAccountIdFromDb: async accountName => {
            const account = await accountModel.findOne({ name: accountName });
            if (account == null) {
                const newAccount = await getNewAccount(accountModel, accountName);
                return newAccount._id;
            }
            return account._id;
        }
    };
}
