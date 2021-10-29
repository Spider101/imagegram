import express, { Router } from 'express';

import { AccountDAO } from '../database/dao';

import { getAccountController } from '../controllers';
import { getAccountService } from '../services';
import { AccountController, AccountService } from '../interfaces/account';

export function getAccountRouter(accountDAO: AccountDAO): Router {
    const accountRouter: Router = express.Router();

    const accountService: AccountService = getAccountService(accountDAO);
    const accountController: AccountController = getAccountController(accountService);

    accountRouter.post('/', accountController.createAccountHandler);
    accountRouter.delete('/:accountId', accountController.deleteAccountHandler);

    return accountRouter;
}