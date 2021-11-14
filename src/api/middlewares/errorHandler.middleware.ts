import { NextFunction, Request, Response } from 'express';
import { HEADERS } from '../../config';
import { ApiError } from '../errors';

export function handleErrors(err: unknown, req: Request, res: Response, _next: NextFunction): void {
    if ((err as ApiError).code && (err as ApiError).message) {
        const apiError = err as ApiError;
        if (apiError.code === 401) {
            res.set(HEADERS.authResponseKey, 'MultiPlexing realm="null"');
        }
        res.status(apiError.code).json({ message: apiError.message });
    } else {
        // if error is not an instance of ApiError, throw an Internal Server Error with a generic message
        res.status(500).json('Something went wrong!');
    }
}