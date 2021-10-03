import { Request, Response } from 'express';
import { LOG } from '../../config';
import { createAccount, deleteAccount } from '../services';

export async function createAccountHandler(req: Request, res: Response): Promise<Response> {
    LOG.info(`Creating account for user with name: ${req.body.name}`);

    const createdAccount = await createAccount(req.body);
    return res.send(createdAccount);
}

export async function deleteAccountHandler(req: Request, res: Response): Promise<Response> {
    const accountId = req.params.accountId;
    LOG.info(`Deleting account data associated with ID: ${accountId}`);
    await deleteAccount(accountId);
    return res.sendStatus(204);
}