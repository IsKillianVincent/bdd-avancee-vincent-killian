const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/database');

let serviceId;

describe('Service Controller', () => {
  beforeAll(async () => {
    const [result] = await db.query('INSERT INTO services (name, office_number) VALUES (?, ?)', ['Test Service', '101']);
    serviceId = result.insertId;
  });

  afterAll(async () => {
    await db.query('DELETE FROM services WHERE id = ?', [serviceId]);
    await db.end();
  });

  test('GET /services - should fetch all services', async () => {
    const response = await request(app).get('/services');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('GET /services/:id - should fetch a single service', async () => {
    const response = await request(app).get(`/services/${serviceId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Service');
  });
});
