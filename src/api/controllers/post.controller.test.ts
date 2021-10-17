import { Request, Response, Send } from 'express';

import { getPostController } from '.';
import { PostController } from '../interfaces/post';

const mockPostService = {
    createPost: jest.fn(),
    fetchAllPosts: jest.fn()
};

const postController: PostController = getPostController(mockPostService);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Post creation -', () => {
    // TODO: move the fake request and response object creation logic to a common helper module
    const fakeRequest = {
        body: { caption: 'fake caption' },
        header: _name => 'fake account Id'
    } as Request;

    test('post is created with valid file data', async () => {
        // setup
        const fakeRequestWithFileData = {
            ...fakeRequest,
            file: { filename: 'fake image key' } as Express.Multer.File
        } as Request;
        const fakeResponse = {
            send: jest.fn() as Send
        } as Response;
        mockPostService.createPost.mockImplementation(({ caption, creator }, file) =>
            Promise.resolve({ caption, creator, image: file.filename })
        );
        const expectedResponse = {
            caption: fakeRequest.body.caption,
            creator: 'fake account Id',
            image: fakeRequestWithFileData.file?.filename
        };

        // execute
        await postController.createPostHandler(fakeRequestWithFileData, fakeResponse);

        // assert
        expect(mockPostService.createPost).toBeCalledTimes(1);
        expect(fakeResponse.send).toBeCalledWith(expectedResponse);
    });

    test('post is not created when file data is not valid', async () => {
        // setup
        const fakeResponse = {} as Response;
        fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
        fakeResponse.json = jest.fn().mockReturnValue(fakeResponse);

        // execute
        await postController.createPostHandler(fakeRequest, fakeResponse);

        // assert
        expect(mockPostService.createPost).toBeCalledTimes(0);
        expect(fakeResponse.status).toHaveBeenCalledWith(422);
    });
});

describe('Fetching posts - ', () => {
    const fakeRequest = {
        query: { page: '1', size: '5' } as qs.ParsedQs
    } as Request;
    const fakeResponse = {
        send: jest.fn() as Send
    } as Response;

    test('all posts are fetched', async () => {
        // setup
        const expectedResponse = {
            totalItems: 10,
            posts: [],
            totalPages: 2,
            currentPage: 1
        };

        mockPostService.fetchAllPosts.mockImplementation(() =>
            Promise.resolve({
                totalDocs: expectedResponse.totalItems,
                docs: expectedResponse.posts,
                totalPages: expectedResponse.totalPages,
                page: expectedResponse.currentPage + 1
            })
        );

        // execute
        await postController.fetchAllPostsHandler(fakeRequest, fakeResponse);

        // assert
        expect(mockPostService.fetchAllPosts).toBeCalledTimes(1);
        expect(mockPostService.fetchAllPosts).toBeCalledWith(fakeRequest.query.page, fakeRequest.query.size);
        expect(fakeResponse.send).toBeCalledWith(expectedResponse);
    });

    test('exception thrown while fetching all posts is handled', async () => {
        // setup
        const fakeErrorMessage = 'fake error message';
        fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
        mockPostService.fetchAllPosts.mockImplementation(() => {
            throw new Error(fakeErrorMessage);
        });

        // execute
        await postController.fetchAllPostsHandler(fakeRequest, fakeResponse);

        // assert
        expect(fakeResponse.status).toBeCalledWith(500);
        expect(fakeResponse.send).toBeCalledWith({ message: fakeErrorMessage });
    });
});