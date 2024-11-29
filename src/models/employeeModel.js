const pool = require('../data/database');

const getAllEmployees = async () => {
  const [rows] = await pool.query('SELECT * FROM employees');
  return rows;
};

const getEmployeeById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
  return rows[0];
};

const addEmployee = async (employee) => {
  const { first_name, last_name, email, salary, service_id } = employee;
  const [result] = await pool.query(
    'INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, salary, service_id]
  );
  return result.insertId;
};

const updateEmployee = async (id, employee) => {
  const { first_name, last_name, email, salary, service_id } = employee;
  const [result] = await pool.query(
    `UPDATE employees 
     SET first_name = ?, last_name = ?, email = ?, salary = ?, service_id = ?
     WHERE id = ?`,
    [first_name, last_name, email, salary, service_id, id]
  );
  return result.affectedRows;
};

const deleteEmployee = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM employees WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};



module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
