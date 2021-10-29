import { Connection, DocumentDefinition, Model, Schema } from 'mongoose';

import { AccountDocument } from '../../interfaces/account';
import getModel from '../modelFactory';
import buildSchema from '../schemas/account.schema';

export interface AccountDAO {
    createNewAccount(account: DocumentDefinition<AccountDocument>): Promise<AccountDocument>;
    findById(account: string): Promise<AccountDocument | null>;
    deleteAccountById(accountId: string): Promise<AccountDocument>;
}

export function getAccountDAO(connection: Connection): AccountDAO {
    const accountSchema: Schema = buildSchema(connection);
    const accountModel: Model<AccountDocument> = getModel(connection, 'Account', accountSchema);
    return {
        createNewAccount: async account => await accountModel.create(account),
        findById: async accountId => await accountModel.findById(accountId),
        deleteAccountById: async accountId => await accountModel.findById(accountId).deleteOne()
    };
}