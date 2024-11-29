const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/database');

describe('Procedure Controller', () => {
  beforeAll(async () => {
    await db.query('INSERT INTO services (name, office_number) VALUES (?, ?)', ['HR', '101']);
    await db.query('INSERT INTO services (name, office_number) VALUES (?, ?)', ['IT', '102']);
    await db.query('INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)', ['John', 'Doe', `john.doe.${Date.now()}@example.com`, 60000, 1]);
    await db.query('INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)', ['Jane', 'Doe', `jane.doe.${Date.now()}@example.com`, 80000, 2]);
  });

  afterAll(async () => {
    await db.query('DELETE FROM manage');
    await db.query('DELETE FROM employees');
    await db.query('DELETE FROM services');
    await db.end();
  });

  test('GET /procedures/rank-services - should rank services by employee count', async () => {
    const response = await request(app).get('/procedures/rank-services');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('service_name');
    expect(response.body[0]).toHaveProperty('employee_count');
  });

  test('GET /procedures/top5-salary-mass - should get top 5 services by salary mass', async () => {
    const response = await request(app).get('/procedures/top5-salary-mass');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('service_name');
    expect(response.body[0]).toHaveProperty('total_salary_mass');
  });

  test('GET /procedures/managers - should get managers and their services', async () => {
    const response = await request(app).get('/procedures/managers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
