import express, { Router } from 'express';
import { Connection, Model, Schema } from 'mongoose';

import getModel from '../database/modelFactory';
import buildSchema from '../database/schemas/account.schema';

import { getAccountController } from '../controllers';
import { getAccountService } from '../services';
import { AccountController, AccountDocument, AccountService } from '../interfaces/account';

export function getAccountRouter(connection: Connection): Router {
    const accountRouter: Router = express.Router();

    const accountSchema: Schema = buildSchema(connection);
    const accountModel: Model<AccountDocument> = getModel<AccountDocument>(connection, 'Account', accountSchema);
    const accountService: AccountService = getAccountService(accountModel);
    const accountController: AccountController = getAccountController(accountService);

    accountRouter.post('/', accountController.createAccountHandler);
    accountRouter.delete('/:accountId', accountController.deleteAccountHandler);

    return accountRouter;
}