import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { getPostIdHeaderMiddleware } from '.';

describe('Post ID Header Middleware', () => {
    const mockPostDAO = {
        createNewPost: jest.fn(),
        getPaginatedResults: jest.fn(),
        doesPostExist: jest.fn()
    };

    const postIdHeaderMiddleware = getPostIdHeaderMiddleware(mockPostDAO);

    const fakeReqHeader = jest.fn();
    const fakeNext = jest.fn();

    const fakeRequest = {} as Request;
    fakeRequest.header = fakeReqHeader;

    const fakeResponse = {} as Response;

    beforeEach(() => {
        jest.resetAllMocks();

        // these are all chained functions on the Response type, so mock them to return the original response object
        fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.set = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.json = jest.fn().mockReturnValue(fakeResponse);
    });

    test('Post ID header is missing', async () => {
        // setup
        fakeReqHeader.mockReturnValue(null);

        // execute
        await postIdHeaderMiddleware.requirePostIdHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(fakeNext).not.toHaveBeenCalled();
        expect(fakeResponse.status).toBeCalledWith(400);
        expect(fakeResponse.json).toBeCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    test('No post matching the ID in the post ID header is found', async () => {
        // setup
        const nonExistentPostId = Types.ObjectId().toJSON();
        fakeReqHeader.mockReturnValue(nonExistentPostId);
        mockPostDAO.doesPostExist.mockResolvedValue(false);

        // execute
        await postIdHeaderMiddleware.requirePostIdHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockPostDAO.doesPostExist).toBeCalledTimes(1);
        expect(mockPostDAO.doesPostExist).toHaveBeenCalledWith(nonExistentPostId);
        expect(fakeNext).not.toHaveBeenCalled();
        expect(fakeResponse.status).toBeCalledWith(404);
        expect(fakeResponse.json).toBeCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    test('Valid Post matching Id in request header found', async () => {
        // setup
        const validPostId = Types.ObjectId();
        fakeReqHeader.mockReturnValue(validPostId);
        mockPostDAO.doesPostExist.mockResolvedValue(true);

        // execute
        await postIdHeaderMiddleware.requirePostIdHeader(fakeRequest, fakeResponse, fakeNext);

        // assert
        expect(mockPostDAO.doesPostExist).toBeCalledTimes(1);
        expect(mockPostDAO.doesPostExist).toBeCalledWith(validPostId);
        expect(fakeNext).toHaveBeenCalledTimes(1);
        expect(fakeResponse.set).not.toHaveBeenCalled();
        expect(fakeResponse.json).not.toHaveBeenCalled();
        expect(fakeResponse.status).not.toHaveBeenCalled();
    });
});