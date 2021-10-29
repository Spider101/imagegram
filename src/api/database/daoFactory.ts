import { Connection } from 'mongoose';

import { IAccountDAO } from '../interfaces/account';
import { IPostDAO } from '../interfaces/post';
import { getAccountDAO, getPostDAO } from './dao';
import { getCommentDAO, ICommentDAO } from './dao/comment.dao';

export interface IDAOFactory {
    getAccountDAO(): IAccountDAO;
    getPostDAO(): IPostDAO;
    getCommentDAO(): ICommentDAO;
}

export default function getDAOFactory(connection: Connection): IDAOFactory {
    const accountDAO: IAccountDAO = getAccountDAO(connection);
    const postDAO: IPostDAO = getPostDAO(connection);
    const commentDAO: ICommentDAO = getCommentDAO(connection);

    return {
        getAccountDAO: () => accountDAO,
        getPostDAO: () => postDAO,
        getCommentDAO: () => commentDAO
    };
}