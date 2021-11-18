import { Express } from 'express';
import request from 'supertest';
import { SuperAgentRequest } from 'superagent';
import path from 'path';
import fs from 'fs';

import { getMongoTestDAO, MongoTestDAO } from '../db';
import { HEADERS, SERVER } from '../../config';

const TEST_ACCOUNT_NAME = 'fake account name';

describe('Accounts endpoints - ', () => {
    const payload = {
        name: TEST_ACCOUNT_NAME
    };

    let app: Express;
    const mongoTestDAO: MongoTestDAO = getMongoTestDAO();

    beforeAll(async () => {
        // start the mongo memory server and initialize the application with a mongoose conneciton
        app = await mongoTestDAO.init();
    });

    describe('Create account', () => {
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

    describe('Delete account', () => {
        const pathToResourcesDir: string = path.join(__dirname, '..', 'resources');
        const jpegFname = 'test-jpeg-image.jpg';

        test('returns 204 No Response when all account data for given accountId is deleted successfully', async () => {
            // create accounts for two users - A and B
            const accountIdForUserA = await mongoTestDAO.getAccountIdFromDb('User A');
            const accountIdForUserB = await mongoTestDAO.getAccountIdFromDb('User B');

            // create a post form user A's account
            const postCreationResponse = await request(app)
                .post('/posts')
                .set(HEADERS.accountId, accountIdForUserA)
                .attach('image', path.join(pathToResourcesDir, jpegFname))
                .field('caption', 'Post for User A');

            expect(postCreationResponse.statusCode).toBe(201);
            expect(postCreationResponse.body._id).toBeDefined();
            const postIdForUserA = postCreationResponse.body._id;

            expect(postCreationResponse.body.image).toBeDefined();
            const imageKeyForPostByUserA = postCreationResponse.body.image;

            expect(fs.existsSync(path.join(SERVER.storagePath, imageKeyForPostByUserA))).toBeTruthy();

            // create a couple of comments on this post - one by user A and one by user B
            let commentCreationResponse = await request(app)
                .post('/comments')
                .set(HEADERS.accountId, accountIdForUserA)
                .set(HEADERS.postId, postIdForUserA)
                .send({ content: 'Comment on post by User A' });
            expect(commentCreationResponse.statusCode).toBe(201);
            expect(commentCreationResponse.body._id).toBeDefined();
            const commentIdForUserA = commentCreationResponse.body._id;

            commentCreationResponse = await request(app)
                .post('/comments')
                .set(HEADERS.accountId, accountIdForUserB)
                .set(HEADERS.postId, postIdForUserA)
                .send({ content: 'Comment on post by User B' });
            expect(commentCreationResponse.statusCode).toBe(201);
            expect(commentCreationResponse.body._id).toBeDefined();
            const commentIdForUserB = commentCreationResponse.body._id;

            // make a call to delete the account data associated to user A
            const accountDeletionResponse = await request(app).delete(`/accounts/${accountIdForUserA}`);
            expect(accountDeletionResponse.statusCode).toBe(204);

            // assert that the account of user A, post made by user A, comment by user A,
            // comment by user B (because it was made on user A's post) and the associated image on the post
            // are all deleted
            await expect(mongoTestDAO.doesAccountExist(accountIdForUserA)).resolves.toBeFalsy();
            await expect(mongoTestDAO.doesPostExist(postIdForUserA)).resolves.toBeFalsy();
            await expect(mongoTestDAO.doesCommentExist(commentIdForUserA)).resolves.toBeFalsy();
            await expect(mongoTestDAO.doesCommentExist(commentIdForUserB)).resolves.toBeFalsy();
            await expect(mongoTestDAO.doesAccountExist(accountIdForUserB)).resolves.toBeTruthy();
            expect(fs.existsSync(path.join(SERVER.storagePath, imageKeyForPostByUserA))).toBeFalsy();
        });
    });

    afterAll(async () => {
        // close the db connection after all tests finish running
        await mongoTestDAO.shutDown();
    });
});