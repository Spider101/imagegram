import { AccountDAO } from '../database/dao';
import { AccountService } from '../interfaces/account';

export function getAccountService(accountDAO: AccountDAO): AccountService {
    return {
        createAccount: async account => await accountDAO.createNewAccount(account),
        deleteAccount: async accountId => await accountDAO.deleteAccountById(accountId)
    };
}