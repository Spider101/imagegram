import { AccountService, IAccountDAO } from '../interfaces/account';

export function getAccountService(accountDAO: IAccountDAO): AccountService {
    return {
        createAccount: async account => await accountDAO.createNewAccount(account),
        deleteAccount: async accountId => await accountDAO.deleteAccountById(accountId)
    };
}