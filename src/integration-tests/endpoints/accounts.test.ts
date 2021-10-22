import { Express } from 'express';
import request from 'supertest';
import { SuperAgentRequest } from 'superagent';

import { getMongoTestDAO, MongoTestDAO } from '../db';

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

    afterAll(async () => {
        // close the db connection after all tests finish running
        await mongoTestDAO.shutDown();
    });
});
