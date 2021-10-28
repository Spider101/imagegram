import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getAccountHeaderMiddleware } from '.';
import { HEADERS } from '../../config';

const mockAccountDAO = {
    createNewAccount: jest.fn(),
    findById: jest.fn(),
    deleteAccountById: jest.fn()
};

describe('Account Header Middleware', () => {
    const accountHeaderMiddleware = getAccountHeaderMiddleware(mockAccountDAO);
    const fakeReqHeader = jest.fn();

    const fakeRequest = {} as Request;
    fakeRequest.header = fakeReqHeader;

    const fakeResponse = {} as Response;
    const fakeNext = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        // these are all chained functions on the Request type, so mock their return value to return the original object
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
        expect(fakeNext).toBeCalledTimes(0);
        expect(fakeResponse.set).toBeCalledWith(HEADERS.authResponseKey, 'MultiPlexing realm="null"');
        expect(fakeResponse.status).toBeCalledWith(401);
        expect(fakeResponse.json).toBeCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    test('No account matching the ID in the account header is found', async () => {
        // setup
        const nonExistentAccountId = uuidv4();
        fakeReqHeader.mockReturnValue(nonExistentAccountId);
        mockAccountDAO.findById.mockResolvedValue(null);

        // execute
        await accountHeaderMiddleware.requireAccountHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockAccountDAO.findById).toBeCalledTimes(1);
        expect(mockAccountDAO.findById).toBeCalledWith(nonExistentAccountId);
        expect(fakeNext).toBeCalledTimes(0);
        expect(fakeResponse.set).toBeCalledWith(HEADERS.authResponseKey, 'MultiPlexing realm="null"');
        expect(fakeResponse.status).toBeCalledWith(401);
        expect(fakeResponse.json).toBeCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    test('Valid Account matching Id in request header found', async () => {
        // setup
        const validAccountId = uuidv4();
        fakeReqHeader.mockReturnValue(validAccountId);
        mockAccountDAO.findById.mockResolvedValue({});

        // execute
        await accountHeaderMiddleware.requireAccountHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockAccountDAO.findById).toBeCalledTimes(1);
        expect(mockAccountDAO.findById).toBeCalledWith(validAccountId);
        expect(fakeNext).toBeCalledTimes(1);
        expect(fakeResponse.set).toBeCalledTimes(0);
        expect(fakeResponse.json).toBeCalledTimes(0);
        expect(fakeResponse.status).toBeCalledTimes(0);
    });
});