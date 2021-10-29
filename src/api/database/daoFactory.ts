import { Connection } from 'mongoose';
import { AccountDAO, getAccountDAO, getPostDAO, IPostDAO } from './dao';
import { getCommentDAO, ICommentDAO } from './dao/comment.dao';

export interface IDAOFactory {
    getAccountDAO(): AccountDAO;
    getPostDAO(): IPostDAO;
    getCommentDAO(): ICommentDAO;
}

export default function getDAOFactory(connection: Connection): IDAOFactory {
    const accountDAO: AccountDAO = getAccountDAO(connection);
    const postDAO: IPostDAO = getPostDAO(connection);
    const commentDAO: ICommentDAO = getCommentDAO(connection);

    return {
        getAccountDAO: () => accountDAO,
        getPostDAO: () => postDAO,
        getCommentDAO: () => commentDAO
    };
}