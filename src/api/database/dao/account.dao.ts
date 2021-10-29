import { Connection, Model, Schema } from 'mongoose';

import { AccountDocument, IAccountDAO } from '../../interfaces/account';
import getModel from '../modelFactory';
import buildSchema from '../schemas/account.schema';

export function getAccountDAO(connection: Connection): IAccountDAO {
    const accountSchema: Schema = buildSchema(connection);
    const accountModel: Model<AccountDocument> = getModel(connection, 'Account', accountSchema);
    return {
        createNewAccount: async account => await accountModel.create(account),
        findById: async accountId => await accountModel.findById(accountId),
        deleteAccountById: async accountId => await accountModel.findById(accountId).deleteOne()
    };
}