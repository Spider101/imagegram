import { Request, Response, Send } from 'express';
import { getCommentController } from '.';
import { HEADERS } from '../../config';
import { CommentController } from '../interfaces/comment';

const mockCommentService = {
    createComment: jest.fn()
};

const commentController: CommentController = getCommentController(mockCommentService);

test('comment is created', async () => {
    // setup
    const fakeRequest = {
        header: (headerName: string) => (headerName === HEADERS.accountId ? 'fake account Id' : 'fake post Id'),
        body: { content: 'fake content' }
    } as Request;
    const fakeResponse = {
        send: jest.fn() as Send
    } as Response;
    fakeResponse.status = jest.fn().mockReturnValue(fakeResponse);
    mockCommentService.createComment.mockImplementation(({ content, creator, postId }) =>
        Promise.resolve({ content, creator, postId })
    );

    // execute
    await commentController.createCommentHandler(fakeRequest, fakeResponse);

    // assert
    expect(mockCommentService.createComment).toBeCalledTimes(1);
    expect(fakeResponse.send).toBeCalledTimes(1);
    expect(fakeResponse.send).toBeCalledWith(
        expect.objectContaining({
            content: expect.any(String),
            postId: expect.any(String),
            creator: expect.any(String)
        })
    );
});