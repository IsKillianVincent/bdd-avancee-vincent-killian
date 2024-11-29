const serviceModel = require('../models/serviceModel');

const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.getServiceById(id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const serviceId = await serviceModel.addService(req.body);
    res.status(201).json({ id: serviceId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, office_number } = req.body;

    const updatedRows = await serviceModel.updateService(id, { name, office_number });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Service introuvable ou aucune modification n'a été apportée" });
    }

    res.json({ message: 'Service mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await serviceModel.deleteService(id);
    
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de serveur interne' });
  }
};

module.exports = {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
};
