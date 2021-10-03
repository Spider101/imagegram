import { Query } from 'mongoose';
import { DocumentDefinition } from 'mongoose';

import { Account } from '../database/models';
import { AccountDocument } from '../interfaces';

export async function createAccount(account: DocumentDefinition<AccountDocument>): Promise<AccountDocument> {
    return await Account.create(account);
}

export async function deleteAccount(accountId: string): Promise<Query<AccountDocument, AccountDocument>> {
    return await Account.findById(accountId).deleteOne();
}