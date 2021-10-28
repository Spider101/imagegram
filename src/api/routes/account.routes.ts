import express, { Router } from 'express';
import { Connection, Schema } from 'mongoose';

import { AccountDAO, getAccountDAO } from '../database';
import buildSchema from '../database/schemas/account.schema';

import { getAccountController } from '../controllers';
import { getAccountService } from '../services';
import { AccountController, AccountService } from '../interfaces/account';

export function getAccountRouter(connection: Connection): Router {
    const accountRouter: Router = express.Router();

    const accountSchema: Schema = buildSchema(connection);
    const accountDAO: AccountDAO = getAccountDAO(connection, accountSchema);
    const accountService: AccountService = getAccountService(accountDAO);
    const accountController: AccountController = getAccountController(accountService);

    accountRouter.post('/', accountController.createAccountHandler);
    accountRouter.delete('/:accountId', accountController.deleteAccountHandler);

    return accountRouter;
}