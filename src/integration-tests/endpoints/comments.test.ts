import { Express } from 'express';
import request from 'supertest';
import { SuperAgentRequest } from 'superagent';

import { getMongoTestDAO, MongoTestDAO } from '../db';
import { HEADERS } from '../../config';

const mongoTestDAO: MongoTestDAO = getMongoTestDAO();
const TEST_ACCOUNT_NAME = 'fake account name';

describe('Comments endpoints', () => {
    const payload = {
        content: 'fake content for comment on post'
    };

    let app: Express;
    let accountId: string;
    let postId: string;
    beforeAll(async () => {
        app = await mongoTestDAO.init();
        accountId = await mongoTestDAO.getAccountIdFromDb(TEST_ACCOUNT_NAME);
        postId = await mongoTestDAO.getPostIdFromDb(accountId);
    });

    describe('Create comment', () => {
        let createCommentRequest: SuperAgentRequest;
        beforeEach(() => {
            createCommentRequest = request(app).post('/comments');
        });

        test('returns 401 Unauthorized response when account id is not present in headers', async () => {
            const response = await createCommentRequest.send(payload);

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBeDefined();
        });

        test('returns 400 Bad Request response when post id is not present in headers', async () => {
            const response = await createCommentRequest.set(HEADERS.accountId, accountId).send(payload);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        });

        test('returns 201 Created when new comment is created', async () => {
            const response = await createCommentRequest
                .set(HEADERS.accountId, accountId)
                .set(HEADERS.postId, postId)
                .send(payload);

            expect(response.statusCode).toBe(201);
        });

        test('returns parent postId in response when new comment is created', async () => {
            const response = await createCommentRequest
                .set(HEADERS.accountId, accountId)
                .set(HEADERS.postId, postId)
                .send(payload);

            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    postId: expect.any(String),
                    content: expect.any(String),
                    creator: expect.any(String)
                })
            );
            expect(response.body.creator).toEqual(accountId.toString());
            expect(response.body.postId).toEqual(postId.toString());
        });
    });

    afterAll(async () => {
        await mongoTestDAO.shutDown();
    });
});