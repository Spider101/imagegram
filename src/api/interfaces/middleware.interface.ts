import { NextFunction, Request, Response } from 'express';

export interface AccountHeaderMiddleware {
    requireAccountHeader(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface PostIdHeaderMiddleware {
    requirePostIdHeader(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IErrorHandlingMiddleware {
    handleErrors(err: unknown, req: Request, res: Response, next: NextFunction): void;
    handleRouteNotFound(req: Request, res: Response, next: NextFunction): void;
}