import { LOG } from '../../config';

import { AccountController, AccountService } from '../interfaces/account';

export function getAccountController(accountService: AccountService): AccountController {
    return {
        createAccountHandler: async (req, res) => {
            LOG.info(`Creating account for user with name: ${req.body.name}`);

            const createdAccount = await accountService.createAccount(req.body);
            return res.status(201).send(createdAccount);
        },
        deleteAccountHandler: async (req, res) => {
            const accountId = req.params.accountId;
            LOG.info(`Deleting account data associated with ID: ${accountId}`);

            await accountService.deleteAccount(accountId);
            return res.sendStatus(204);
        }
    };
}