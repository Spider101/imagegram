import { Request, Response } from 'express';

export interface AccountController {
    createAccountHandler(req: Request, res: Response): Promise<Response>;
    deleteAccountHandler(req: Request, res: Response): Promise<Response>;
}