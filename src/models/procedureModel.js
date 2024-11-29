const pool = require('../data/database');

const executeRankServicesByEmployees = async () => {
  const [rows] = await pool.query('CALL RankServicesByEmployees()');
  return rows[0];
};

const executeTop5ServicesBySalaryMass = async () => {
  const [rows] = await pool.query('CALL Top5ServicesBySalaryMass()');
  return rows[0];
};

const executeGetManagersAndServices = async () => {
  const [rows] = await pool.query('CALL GetManagersAndServices()');
  return rows[0];
};

module.exports = {
  executeRankServicesByEmployees,
  executeTop5ServicesBySalaryMass,
  executeGetManagersAndServices,
};
