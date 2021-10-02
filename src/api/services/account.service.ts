import { Account } from './../database/models/account.model';
import { DocumentDefinition } from "mongoose";
import { AccountDocument } from "../interfaces";

export async function createAccount(input: DocumentDefinition<AccountDocument>) {
    return await Account.create(input);
}