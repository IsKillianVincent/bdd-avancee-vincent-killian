const procedureModel = require('../models/procedureModel');

const rankServicesByEmployees = async (req, res) => {
  try {
    const result = await procedureModel.executeRankServicesByEmployees();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const top5ServicesBySalaryMass = async (req, res) => {
  try {
    const result = await procedureModel.executeTop5ServicesBySalaryMass();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getManagersAndServices = async (req, res) => {
  try {
    const result = await procedureModel.executeGetManagersAndServices();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  rankServicesByEmployees,
  top5ServicesBySalaryMass,
  getManagersAndServices,
};
