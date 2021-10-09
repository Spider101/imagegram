import { Query, DocumentDefinition } from 'mongoose';

import { AccountDocument } from './document.interface';

export interface AccountService {
    createAccount(account: DocumentDefinition<AccountDocument>): Promise<AccountDocument>;
    deleteAccount(actountId: string): Promise<Query<AccountDocument, AccountDocument>>;
}