const aiService = require('../services/aiService');
const powerBIService = require('../services/powerBIService');

const handleQuery = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const result = await aiService.processQuery(query);
        res.json(result);
    } catch (error) {
        console.error('AI Processing Error:', error);
        res.status(500).json({ error: 'Failed to process query' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const liveData = await powerBIService.fetchPowerBIData();
        res.json(liveData);
    } catch (error) {
        console.error('getDashboardData Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

const getPowerBIDataEndpoint = async (req, res) => {
    try {
        const data = await powerBIService.fetchPowerBIData();
        res.json(data);
    } catch (error) {
        console.error('PowerBI Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch Power BI data' });
    }
};

module.exports = { handleQuery, getDashboardData, getPowerBIDataEndpoint };
