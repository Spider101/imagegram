import { Express } from 'express';
import { Connection } from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server-core';
import request from 'supertest';
import { SuperAgentRequest } from 'superagent';
import path from 'path';

import buildApplication from '../api/app';
import getDbConnection from '../api/database/connect';
import { HEADERS, LOG, SERVER } from '../config';
import { getMongoTestDAO, MongoTestDAO } from './db';
import { deleteFilesInDirectory } from './helper';

let connection: Connection;
let mongoServer: MongoMemoryServer;

let app: Express;
let mongoTestDAO: MongoTestDAO;

const TEST_ACCOUNT_NAME = 'fake account name';

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const connectionString = mongoServer.getUri();
    LOG.info(`Started the mongo server for integration tests using ${connectionString} as the connection string`);

    connection = getDbConnection(connectionString);
    app = buildApplication(connection);
    mongoTestDAO = getMongoTestDAO(connection);
});

describe('Healtcheck endpoint', () => {
    test('returns 200 OK response', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.statusCode).toBe(200);
    });

    test('return expected payload', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.body).toEqual(
            expect.objectContaining({
                uptime: expect.any(Number),
                message: expect.any(String),
                timestamp: expect.any(Number) // Date.now() returns a number
            })
        );
    });
});

describe('Accounts endpoints - ', () => {
    const payload = {
        name: TEST_ACCOUNT_NAME
    };

    describe('Create account endpoint', () => {
        let createAccountRequest: SuperAgentRequest;
        beforeEach(() => {
            createAccountRequest = request(app).post('/accounts');
        });

        test('returns 201 Created response', async () => {
            const response = await createAccountRequest.send(payload);
            expect(response.statusCode).toBe(201);
        });

        test('returns response with _id field corresponding to newly created account', async () => {
            const response = await createAccountRequest.send(payload);
            expect(response.body._id).toBeDefined();
        });
    });
});

describe('Posts endpoints - ', () => {
    let accountId: string;
    beforeAll(async () => {
        accountId = await mongoTestDAO.getAccountIdFromDb(TEST_ACCOUNT_NAME);
    });

    describe('Create posts endpoint', () => {
        let createPostRequest: SuperAgentRequest;
        beforeEach(() => {
            createPostRequest = request(app).post('/posts');
        });

        afterEach(() => {
            deleteFilesInDirectory(SERVER.storagePath);
        });

        test('returns 401 Unauthorized response when account id is not present in headers', async () => {
            const response = await createPostRequest
                .attach('image', path.join(__dirname, 'resources', 'test-jpeg-image.jpg'))
                .field('caption', 'fake post caption');

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBeDefined();
        });

        test('returns 422 Unprocessable response when file is not in correct format', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(__dirname, 'resources', 'test-not-image-file.txt'))
                .field('caption', 'fake post caption');

            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBeDefined();
        });

        test('returns 201 Created response', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(__dirname, 'resources', 'test-jpeg-image.jpg'))
                .field('caption', 'fake post caption');
            expect(response.statusCode).toBe(201);
        });

        test('returns response with _id and image fields for newly created post', async () => {
            const response = await createPostRequest
                .set(HEADERS.accountId, accountId)
                .attach('image', path.join(__dirname, 'resources', 'test-jpeg-image.jpg'))
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
});

describe('Comments endpoints -', () => {
    const payload = {
        content: 'fake content for comment on post'
    };

    let accountId: string;
    let postId: string;
    beforeAll(async () => {
        accountId = await mongoTestDAO.getAccountIdFromDb(TEST_ACCOUNT_NAME);
        postId = await mongoTestDAO.getPostIdFromDb(accountId);
    });

    describe('Create comments endpoint', function () {
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
});

afterAll(async () => {
    // close the db connection after all tests finish running
    if (connection) {
        LOG.info('Shutting down mongoose connection...');
        await connection.close();
    }

    // stop the mongo server after all the tests finish running
    if (mongoServer) {
        LOG.info('Stopping mongo server for integration tests...');
        await mongoServer.stop();
    }
});