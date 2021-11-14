import { NextFunction, Request, Response } from 'express';

export interface IPostController {
    createPostHandler(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    fetchAllPostsHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}