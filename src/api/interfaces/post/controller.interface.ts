import { Request, Response } from 'express';

export interface PostController {
    createPostHandler(req: Request, res: Response): Promise<Response>;
    fetchAllPostsHandler(req: Request, res: Response): Promise<Response>;
}