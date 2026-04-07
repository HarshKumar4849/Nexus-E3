const express = require('express');
const router = express.Router();
const { calculateETA } = require('../controllers/etaController');

// GET /api/eta/calculate/:startStopId/:endStopId
router.get('/calculate/:startStopId/:endStopId', calculateETA);

module.exports = router;
