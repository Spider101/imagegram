import { Model } from 'mongoose';

import { AccountDocument, AccountService } from '../interfaces/account';

export function getAccountService(accountModel: Model<AccountDocument>): AccountService {
    return {
        createAccount: async account => await accountModel.create(account),
        deleteAccount: async accountId => await accountModel.findById(accountId).deleteOne()
    };
}