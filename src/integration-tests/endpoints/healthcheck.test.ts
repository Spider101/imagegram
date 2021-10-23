import { Express } from 'express';
import request from 'supertest';

import { getMongoTestDAO, MongoTestDAO } from '../db';

const mongoTestDAO: MongoTestDAO = getMongoTestDAO();

describe('Healthcheck endpoint', () => {
    let app: Express;
    beforeAll(async () => {
        app = await mongoTestDAO.init();
    });

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

    afterAll(async () => {
        await mongoTestDAO.shutDown();
    });
});