import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { getAccountHeaderMiddleware } from '.';

describe('Account Header Middleware', () => {
    const mockAccountDAO = {
        createNewAccount: jest.fn(),
        findById: jest.fn(),
        deleteAccountById: jest.fn()
    };

    const accountHeaderMiddleware = getAccountHeaderMiddleware(mockAccountDAO);
    const fakeReqHeader = jest.fn();

    const fakeRequest = {} as Request;
    fakeRequest.header = fakeReqHeader;

    const fakeResponse = {} as Response;
    const fakeNext = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        // these are all chained functions on the Response type, so mock them to return the original response object
        fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.set = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.json = jest.fn().mockReturnValue(fakeResponse);
    });

    test('Account Header is missing', async () => {
        // setup
        fakeReqHeader.mockReturnValue(null);

        // execute
        await accountHeaderMiddleware.requireAccountHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeNext).toBeCalledWith(
            expect.objectContaining({
                code: 401,
                message: expect.any(String)
            })
        );
        assertExpressResponse(fakeResponse);
    });

    test('No account matching the ID in the account header is found', async () => {
        // setup
        const nonExistentAccountId = Types.ObjectId().toJSON();
        fakeReqHeader.mockReturnValue(nonExistentAccountId);
        mockAccountDAO.findById.mockResolvedValue(null);

        // execute
        await accountHeaderMiddleware.requireAccountHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockAccountDAO.findById).toBeCalledTimes(1);
        expect(mockAccountDAO.findById).toBeCalledWith(nonExistentAccountId);
        expect(fakeNext).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 401,
                message: expect.any(String)
            })
        );
        assertExpressResponse(fakeResponse);
    });

    test('Valid Account matching Id in request header found', async () => {
        // setup
        const validAccountId = Types.ObjectId().toJSON();
        fakeReqHeader.mockReturnValue(validAccountId);
        mockAccountDAO.findById.mockResolvedValue({});

        // execute
        await accountHeaderMiddleware.requireAccountHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockAccountDAO.findById).toBeCalledTimes(1);
        expect(mockAccountDAO.findById).toBeCalledWith(validAccountId);
        expect(fakeNext).toBeCalledTimes(1);
        expect(fakeNext).not.toHaveBeenCalledWith(
            expect.objectContaining({
                code: expect.any(Number),
                message: expect.any(String)
            })
        );
        assertExpressResponse(fakeResponse);
    });
});

function assertExpressResponse(fakeResponse: Response){
    expect(fakeResponse.set).not.toHaveBeenCalled();
    expect(fakeResponse.json).not.toHaveBeenCalled();
    expect(fakeResponse.status).not.toHaveBeenCalled();
}