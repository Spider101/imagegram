import { Request, Response } from 'express';

export interface CommentController {
    createCommentHandler(req: Request, res: Response): Promise<Response>;
}