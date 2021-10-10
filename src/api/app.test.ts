import { Connection } from 'mongoose';
import request from 'supertest';
import { DB } from '../config';
import buildApplication from './app';
import getDbConnection from './database/connect';

const connection: Connection = getDbConnection(DB.uri);

const app = buildApplication(connection);

describe('Healtcheck endpoint', () => {
    test('returns 200 OK response', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.statusCode).toBe(200);
    });
    test('return expected payload', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.body).toEqual(expect.objectContaining({
            uptime: expect.any(Number),
            message: expect.any(String),
            timestamp: expect.any(Number) // Date.now() returns a number
        }))
    })
});

afterAll(done => {
    // close the db connection after all tests finish running
    connection.close();
    done();
});