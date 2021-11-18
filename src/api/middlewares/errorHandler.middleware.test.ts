import { NextFunction, Request, Response } from 'express';
import { getErrorHandlingMiddleware } from '.';
import { HEADERS } from '../../config';
import { ApiError } from '../errors';
import { IErrorHandlingMiddleware } from '../interfaces/middleware.interface';

describe('Error Handling Middleware', () => {
    const fakeRequest = {} as Request;
    const fakeResponse = {} as Response;
    const fakeNext = jest.fn() as NextFunction;
    const fakeError = {} as ApiError;

    const errorHandlingMiddleware: IErrorHandlingMiddleware = getErrorHandlingMiddleware();

    beforeEach(() => {
        jest.clearAllMocks();

        fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.json = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.set = jest.fn().mockReturnValue(fakeResponse);
    });

    test('Valid ApiError is received', () => {
        // setup
        fakeError.code = 400;
        fakeError.message = 'Fake API error';

        // execute
        errorHandlingMiddleware.handleErrors(fakeError, fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeResponse.status).toBeCalledWith(fakeError.code);
        expect(fakeResponse.json).toBeCalledWith(
            expect.objectContaining({
                message: fakeError.message
            })
        );
    });

    test('A 401 Unauthorized ApiError is received', () => {
        // setup
        fakeError.code = 401;
        fakeError.message = 'Fake Unauthorized error';

        // execute
        errorHandlingMiddleware.handleErrors(fakeError, fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeResponse.status).toBeCalledWith(fakeError.code);
        expect(fakeResponse.json).toBeCalledWith(
            expect.objectContaining({
                message: fakeError.message
            })
        );
        expect(fakeResponse.set).toBeCalledWith(HEADERS.authResponseKey, 'MultiPlexing realm="null"');
    });

    test('Generic error is received', () => {
        // execute
        errorHandlingMiddleware.handleErrors({}, fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeResponse.status).toBeCalledWith(500);
        expect(fakeResponse.json).toBeCalledWith('Something went wrong!');
    });

    test('Unknown route is handled', () => {
        // execute
        errorHandlingMiddleware.handleRouteNotFound(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeNext).toBeCalledWith(
            expect.objectContaining({
                code: 404,
                message: expect.any(String)
            })
        );
    });
});