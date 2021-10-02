import { Request, Response } from "express";
import { LOG } from "../../config";
import { createAccount } from "../services";

export async function createAccountHandler(req: Request, res: Response) {
    LOG.info(`Creating account for user with name: ${req.body.name}`);

    const createdAccount = await createAccount(req.body);
    return res.send(createdAccount);
}