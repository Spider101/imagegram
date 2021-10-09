import { Connection } from 'mongoose';

import { AccountDocument } from '../interfaces/account';
import { AccountHeaderMiddleware } from '../interfaces/middleware.interface';
import { HEADERS, LOG } from '../../config';

export function getAccountHeaderMiddleware(connection: Connection): AccountHeaderMiddleware {
    return {
        requireAccountHeader: async (req, res, next) => {
            const accountId = req.header(HEADERS.accountId);
            if (accountId) {
                LOG.info(`Trying to find document for account with ID: ${accountId}...`);

                const account = await connection.model<AccountDocument>('Account').findById(accountId);

                // findById returns null when document is not found
                if (account != null) {
                    // accountId belonged to a valid account, so we can proceed
                    return next();
                }
            }
            res.set(HEADERS.authResponseKey, 'MultiPlexing realm="null"');
            res.status(401).json({ message: 'Credentials are required to access this resource!' });
        }
    };
}