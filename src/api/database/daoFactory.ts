import { Connection } from 'mongoose';
import { AccountDAO, getAccountDAO, getPostDAO, IPostDAO } from './dao';

export interface IDAOFactory {
    getAccountDAO(): AccountDAO;
    getPostDAO(): IPostDAO;
}

export default function getDAOFactory(connection: Connection): IDAOFactory {
    const accountDAO: AccountDAO = getAccountDAO(connection);
    const postDAO: IPostDAO = getPostDAO(connection);

    return {
        getAccountDAO: () => accountDAO,
        getPostDAO: () => postDAO
    };
}