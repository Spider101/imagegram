import { Account } from '../database/models';
import { DocumentDefinition } from "mongoose";
import { AccountDocument } from "../interfaces";

export async function createAccount(account: DocumentDefinition<AccountDocument>) {
    return await Account.create(account);
}

export async function deleteAccount(accountId: string) {
    return await Account.findById(accountId).deleteOne();
}