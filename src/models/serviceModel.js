const pool = require('../data/database');

const getAllServices = async () => {
  const [rows] = await pool.query('SELECT * FROM services');
  return rows;
};

const getServiceById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0];
};

const addService = async (service) => {
  const { name, office_number } = service;
  const [result] = await pool.query(
    'INSERT INTO services (name, office_number) VALUES (?, ?)',
    [name, office_number]
  );
  return result.insertId;
};

const updateService = async (id, service) => {
  const { name, office_number } = service;
  const [result] = await pool.query(
    'UPDATE services SET name = ?, office_number = ? WHERE id = ?',
    [name, office_number, id]
  );
  return result.affectedRows;
};

const deleteService = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM services WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};
