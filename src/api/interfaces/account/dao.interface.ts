import { DocumentDefinition } from 'mongoose';

import { AccountDocument } from '.';

export interface IAccountDAO {
    createNewAccount(account: DocumentDefinition<AccountDocument>): Promise<AccountDocument>;
    findById(account: string): Promise<AccountDocument | null>;
    deleteAccountById(accountId: string): Promise<AccountDocument>;
}