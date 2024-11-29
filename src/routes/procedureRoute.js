const express = require('express');
const procedureController = require('../controllers/procedureController');

const router = express.Router();

router.get('/rank-services', procedureController.rankServicesByEmployees);
router.get('/top5-salary-mass', procedureController.top5ServicesBySalaryMass);
router.get('/managers', procedureController.getManagersAndServices);

module.exports = router;
