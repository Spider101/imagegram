import { HEADERS } from '../../config';
import { ApiError } from '../errors';
import { ErrorHandlerMiddleware } from '../interfaces/middleware.interface';

export function getErrorHandlingMiddleware(): ErrorHandlerMiddleware {
    return {
        handleErrors(err, req, res, _next) {
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
    };
}