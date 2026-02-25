
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// AI Natural Language Query
router.post('/query', analyticsController.handleQuery);

// Pre-built Dashboard Data
router.get('/dashboard/:type', analyticsController.getDashboardData);

module.exports = router;
