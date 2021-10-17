import { Express } from 'express';
import { Connection } from 'mongoose';
import request from 'supertest';
import buildApplication from '../api/app';
import getDbConnection from '../api/database/connect';
import MongoMemoryServer from 'mongodb-memory-server-core';
import { LOG } from '../config';

let connection: Connection;
let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const connectionString = mongoServer.getUri();
    LOG.info(`Started the mongo server for integration tests using ${connectionString} as the connection string`);

    connection = getDbConnection(connectionString);
    app = buildApplication(connection);
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

describe('Accounts endpoint', () => {
    const fakeAccountName = 'fake account name';
    test('returns 201 Created response', async () => {
        const response = await request(app).post('/accounts').send({
            name: fakeAccountName
        });
        expect(response.statusCode).toBe(201);
    });

    test('response has _id', async () => {
        const response = await request(app).post('/accounts').send({
            name: fakeAccountName
        });
        expect(response.body._id).toBeDefined();
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