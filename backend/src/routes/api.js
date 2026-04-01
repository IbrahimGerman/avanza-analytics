
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

const exportController = require('../controllers/exportController');

// AI Natural Language Query
router.post('/query', analyticsController.handleQuery);
// Power BI Direct Query for AI
router.post('/ai-query', analyticsController.handleQuery);

// Pre-built Dashboard Data
router.get('/dashboard/:type', analyticsController.getDashboardData);

// Power BI Live Data Endpoint
router.get('/powerbi-data', analyticsController.getPowerBIDataEndpoint);

// Export Functionality
router.get('/export/excel', exportController.exportExcel);
router.get('/export/pdf', exportController.exportPdf);

module.exports = router;
