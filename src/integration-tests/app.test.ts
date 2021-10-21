import { Express } from 'express';
import { Connection } from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server-core';
import request from 'supertest';
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
    const fakeAccountName = TEST_ACCOUNT_NAME;
    describe('Create account endpoint', () => {
        test('returns 201 Created response', async () => {
            const response = await request(app).post('/accounts').send({
                name: fakeAccountName
            });
            expect(response.statusCode).toBe(201);
        });

        test('returns response with _id field corresponding to newly created account', async () => {
            const response = await request(app).post('/accounts').send({
                name: fakeAccountName
            });
            expect(response.body._id).toBeDefined();
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