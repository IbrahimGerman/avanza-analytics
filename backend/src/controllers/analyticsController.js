
const aiService = require('../services/aiService');

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
    const { type } = req.params;
    // Return static/pre-calc data for the 3 main dashboards
    // Executive, Branch, Ops

    const mockResponse = {
        title: `${type.toUpperCase()} Dashboard`,
        kpis: [
            { label: 'Revenue', value: '$1.2M', change: '+5%', trend: 'up' },
            { label: 'Costs', value: '$0.8M', change: '-2%', trend: 'down' },
            { label: 'Profit', value: '$0.4M', change: '+12%', trend: 'up' },
            { label: 'NPS', value: '72', change: '+1', trend: 'up' }
        ],
        charts: [
            {
                type: 'line',
                title: 'Revenue Trend',
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: '2023',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#1F4FD8',
                    tension: 0.4
                }]
            },
            {
                type: 'bar',
                title: 'Branch Performance',
                labels: ['NY', 'LDN', 'SG', 'HK', 'TOK'],
                datasets: [{
                    label: 'Sales',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: '#00D1B2'
                }]
            }
        ]
    };

    res.json(mockResponse);
};

module.exports = { handleQuery, getDashboardData };
