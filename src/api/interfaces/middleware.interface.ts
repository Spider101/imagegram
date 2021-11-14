import { NextFunction, Request, Response } from 'express';

export interface AccountHeaderMiddleware {
    requireAccountHeader(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface PostIdHeaderMiddleware {
    requirePostIdHeader(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ErrorHandlerMiddleware {
    handleErrors(err: unknown, req: Request, res: Response, next: NextFunction): void;
}