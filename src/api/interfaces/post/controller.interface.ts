import { NextFunction, Request, Response } from 'express';

export interface PostController {
    createPostHandler(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    fetchAllPostsHandler(req: Request, res: Response): Promise<Response>;
}