import { Account } from '../database/models/account.model';
import { NextFunction, Request, Response } from "express";
import { HEADERS } from "../../config";

export async function requireAccountHeader(req: Request, res: Response, next: NextFunction) {
    const accountId = req.header(HEADERS.accountId);
    if (accountId) {
        const account = await Account.findById(accountId);

        // findById returns null when document is not found
        if (account != null) {
            // accountId belonged to a valid account, so we can proceed
            return next();
        }
    }
    res.set(HEADERS.authResponseKey, 'MultiPlexing realm="null"')
    res.status(401).json({ message: 'Credentials are required to access this resource!'})
}