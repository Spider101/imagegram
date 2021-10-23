import { Express } from 'express';
import request from 'supertest';
import { SuperAgentRequest } from 'superagent';
import path from 'path';

import { getMongoTestDAO, MongoTestDAO } from '../db';
import { HEADERS } from '../../config';

const mongoTestDAO: MongoTestDAO = getMongoTestDAO();
const TEST_ACCOUNT_NAME = 'fake account name';

describe('Posts endpoints -', () => {
    const pathToResourcesDir: string = path.join(__dirname, '..', 'resources');
    const txtFname = 'test-text-file.txt';
    const jpegFname = 'test-jpeg-image.jpg';

    let accountId: string;
    let app: Express;
    beforeAll(async () => {
        app = await mongoTestDAO.init();
        accountId = await mongoTestDAO.getAccountIdFromDb(TEST_ACCOUNT_NAME);
    });

    describe('Create post', () => {
        let createPostRequest: SuperAgentRequest;
        beforeEach(() => {
            createPostRequest = request(app).post('/posts');
        });

        test('returns 401 Unauthorized response when account id is not present in headers', async () => {
            const response = await createPostRequest
                .attach('image', path.join(pathToResourcesDir, jpegFname))
                .field('caption', 'fake post caption');

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBeDefined();
        });

        test('returns 422 Unprocessable response when file is not in correct format', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(pathToResourcesDir, txtFname))
                .field('caption', 'fake post caption');

            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBeDefined();
        });

        test('returns 201 Created response', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(pathToResourcesDir, jpegFname))
                .field('caption', 'fake post caption');
            expect(response.statusCode).toBe(201);
        });

        test('returns response with _id and image fields for newly created post', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(pathToResourcesDir, jpegFname))
                .field('caption', 'fake post caption');

            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    caption: expect.any(String),
                    creator: expect.any(String),
                    image: expect.any(String)
                })
            );

            expect(response.body.creator).toEqual(accountId.toString());
        });
    });

    describe('Fetch all posts', () => {
        let fetchAllPostsRequest: SuperAgentRequest;
        beforeEach(() => {
            fetchAllPostsRequest = request(app).get('/posts');
        });

        test('returns 401 Unauthorized response when account id is not present in headers', async () => {
            const response = await fetchAllPostsRequest;

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBeDefined();
        });

        test('returns 200 OK response', async () => {
            const response = await fetchAllPostsRequest.set(HEADERS.accountId, accountId);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    totalItems: expect.any(Number),
                    totalPages: expect.any(Number),
                    currentPage: expect.any(Number)
                })
            );
            const posts = response.body.posts;
            expect(posts).not.toBeNull();
            expect(posts.length).toBeGreaterThan(0);
            posts.forEach((post: unknown) => {
                expect(post).toEqual(
                    expect.objectContaining({
                        _id: expect.any(String),
                        caption: expect.any(String),
                        image: expect.any(String),
                        creator: expect.any(String)
                    })
                );

                // if the assertion above passed, then we can safely type assert post to an object
                const comments = (post as Record<string, unknown>).comments;
                expect(comments).not.toBeNull();

                if (Array.isArray(comments) && comments.length > 0) {
                    comments.forEach(comment => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                _id: expect.any(String),
                                content: expect.any(String),
                                creator: expect.any(String)
                            })
                        );
                    });
                }
            });
        });
    });

    afterAll(async () => {
        await mongoTestDAO.shutDown();
    });
});