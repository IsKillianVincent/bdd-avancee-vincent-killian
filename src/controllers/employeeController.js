const employeeModel = require('../models/employeeModel');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeModel.getEmployeeById(id);
    if (!employee) return res.status(404).json({ message: 'Employé introuvable' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employeeId = await employeeModel.addEmployee(req.body);
    res.status(201).json({ id: employeeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, salary, service_id } = req.body;
  
      const updatedRows = await employeeModel.updateEmployee(id, { first_name, last_name, email, salary, service_id });
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Employé introuvable ou aucune modification n'a été apportée" });
      }
  
      res.json({ message: 'Employé a été mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const deleteEmployee = async (req, res) => {
    try {
      const { id } = req.params;
  
    
      const deletedRows = await employeeModel.deleteEmployee(id);
  
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Employé non trouvé' });
      }
  
      res.json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
