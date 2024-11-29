const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/database');

const mockEmployee = {
  first_name: 'John',
  last_name: 'Doe',
  email: `john.doe.${Date.now()}@example.com`, // Email unique pour chaque test
  salary: 50000,
  service_id: 1,
};

let employeeId;

describe('Employee Controller', () => {
  beforeAll(async () => {
    // Préparer une entrée de service pour éviter les erreurs de clé étrangère
    const [result] = await db.query('INSERT INTO services (name, office_number) VALUES (?, ?)', ['HR', '101']);
    mockEmployee.service_id = result.insertId;
  });

  afterAll(async () => {
    // Nettoyer les données après tous les tests
    await db.query('DELETE FROM employees WHERE id = ?', [employeeId]);
    await db.query('DELETE FROM services WHERE id = ?', [mockEmployee.service_id]);
    await db.end(); // Fermer la connexion
  });

  beforeEach(async () => {
    // Insérer un employé avant chaque test
    const [result] = await db.query(
      'INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)',
      [mockEmployee.first_name, mockEmployee.last_name, mockEmployee.email, mockEmployee.salary, mockEmployee.service_id]
    );
    employeeId = result.insertId;
  });

  afterEach(async () => {
    // Nettoyer l'employé inséré après chaque test
    await db.query('DELETE FROM employees WHERE id = ?', [employeeId]);
  });

  test('GET /employees - should fetch all employees', async () => {
    const response = await request(app).get('/employees');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('GET /employees/:id - should fetch a single employee', async () => {
    const response = await request(app).get(`/employees/${employeeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      first_name: mockEmployee.first_name,
      last_name: mockEmployee.last_name,
      email: mockEmployee.email,
    });
  });

  test('POST /employees - should create a new employee', async () => {
    const newEmployee = { ...mockEmployee, email: `jane.doe.${Date.now()}@example.com` }; // Unique email
    const response = await request(app).post('/employees').send(newEmployee);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    const insertedId = response.body.id;

    await db.query('DELETE FROM employees WHERE id = ?', [insertedId]); // Nettoyer après insertion
  });

  test('PUT /employees/:id - should update an existing employee', async () => {
    const updatedEmployee = { ...mockEmployee, first_name: 'Updated' };
    const response = await request(app).put(`/employees/${employeeId}`).send(updatedEmployee);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Employee updated successfully');
  });

  test('DELETE /employees/:id - should delete an employee', async () => {
    const response = await request(app).delete(`/employees/${employeeId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Employee deleted successfully');
  });
});
