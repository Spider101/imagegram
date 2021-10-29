import * as faker from 'faker';
import { Types } from 'mongoose';

import { getPostService } from '.';
import { PostService } from '../interfaces/post';

describe('Post service', () => {
    const mockPostDAO = {
        createNewPost: jest.fn(),
        doesPostExist: jest.fn(),
        getPaginatedResults: jest.fn()
    };

    const postService: PostService = getPostService(mockPostDAO);
    test('createPost() returns a valid post', async () => {
        // setup
        const postCaption = 'fake post caption';
        const postCreator = 'fake post creator';
        const imageKey = 'fake image key';
        mockPostDAO.createNewPost.mockResolvedValue({
            caption: postCaption,
            creator: postCreator,
            image: imageKey
        });

        // execute
        const post = await postService.createPost({ caption: postCaption, creator: postCreator }, {
            filename: imageKey
        } as Express.Multer.File);

        // assert
        expect(post).toEqual(
            expect.objectContaining({
                caption: expect.any(String),
                creator: expect.any(String),
                image: expect.any(String)
            })
        );
        expect(post.caption).toEqual(postCaption);
        expect(post.creator).toEqual(postCreator);
        expect(post.image).toEqual(imageKey);
    });

    test('fetchAllPosts() returns paginated list of posts', async () => {
        // setup
        const page = 1;
        const size = 4;
        mockPostDAO.getPaginatedResults.mockResolvedValue({
            totalDocs: 0,
            totalPages: 0,
            page: 1,
            docs: getFakePosts(3)
        });

        // execute
        const paginatedResults = await postService.fetchAllPosts(page.toString(), size.toString());

        // assert
        expect(paginatedResults).toEqual(
            expect.objectContaining({
                totalDocs: expect.any(Number),
                totalPages: expect.any(Number),
                page: expect.any(Number)
            })
        );

        expect(mockPostDAO.getPaginatedResults).toBeCalledTimes(1);

        // verify that the getPaginatedResults fn is called with the correct options and query
        const [query, options] = mockPostDAO.getPaginatedResults.mock.calls[0];
        expect(query).toEqual({});
        expect(options).toEqual(
            expect.objectContaining({
                populate: expect.objectContaining({
                    path: expect.any(String),
                    options: expect.objectContaining({
                        sort: expect.objectContaining({ createdAt: expect.any(Number) }),
                        perDocumentLimit: expect.any(Number)
                    })
                }),
                offset: expect.any(Number),
                limit: expect.any(Number),
                sort: expect.objectContaining({ numComments: expect.any(Number) })
            })
        );
        expect(options.sort.numComments).toBe(-1);
        expect(options.populate.path).toEqual('comments');
    });

    describe('fetchAllPosts() handles any error thrown - ', () => {
        const page = '1';
        const size = '3';
        const expectedErrorMessage = 'fake error message';

        test('string error thrown', async () => {
            // setup
            mockPostDAO.getPaginatedResults.mockImplementation(() => {
                throw expectedErrorMessage;
            });

            // execute
            try {
                await postService.fetchAllPosts(page, size);
            } catch (e: unknown) {
                // assert
                expect(e instanceof Error).toBeTruthy();

                const error = e as Error;
                expect(error.message).toEqual(expectedErrorMessage.toUpperCase());
            }
        });

        test('Error instance thrown as error', async () => {
            // setup
            mockPostDAO.getPaginatedResults.mockImplementation(() => {
                throw new Error(expectedErrorMessage);
            });

            // execute
            try {
                await postService.fetchAllPosts(page, size);
            } catch (e: unknown) {
                // assert
                expect(e instanceof Error).toBeTruthy();

                const error = e as Error;
                expect(error.message).toEqual(expectedErrorMessage);
            }
        });

        test('Unexpected error type is thrown', async () => {
            // setup
            mockPostDAO.getPaginatedResults.mockImplementation(() => {
                throw 123;
            });

            // execute
            try {
                await postService.fetchAllPosts(page, size);
            } catch (e: unknown) {
                // assert
                expect(e instanceof Error).toBeTruthy();

                const error = e as Error;
                expect(error.message).toEqual('Something went wrong while fetching all posts!');
            }
        });
    });
});

function getFakePosts(numPosts: number, numComments = 0) {
    return [...Array(numPosts)].map(() => {
        const comments = [...Array(numComments)].map(() => ({
            content: faker.lorem.sentence(),
            creator: Types.ObjectId().toJSON()
        }));

        return {
            caption: faker.lorem.slug(3),
            image: faker.system.filePath(),
            creator: Types.ObjectId().toJSON(),
            comments
        };
    });
}