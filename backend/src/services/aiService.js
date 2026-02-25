
// backend/src/services/aiService.js

/**
 * Mock AI Service to simulate LLM behavior for Banking Analytics.
 * In production, this would call OpenAI/Anthropic APIs.
 */

const getIntent = (query) => {
    const q = query.toLowerCase();
    if (q.includes('performance') || q.includes('ranking')) return 'RANKING';
    if (q.includes('trend') || q.includes('over time') || q.includes('monthly')) return 'TREND';
    if (q.includes('compare') || q.includes('vs')) return 'COMPARISON';
    if (q.includes('distribution') || q.includes('breakdown')) return 'DISTRIBUTION';
    return 'KPI_LOOKUP';
};

const generateSQL = (query, intent) => {
    // Mock SQL generation based on keywords
    // Real implementation would send schema + query to LLM
    const q = query.toLowerCase();

    if (intent === 'RANKING' && q.includes('branch')) {
        return `SELECT name, sum(amount) as total_sales FROM sales JOIN branches ON sales.branch_id = branches.id GROUP BY name ORDER BY total_sales DESC LIMIT 5;`;
    }
    if (intent === 'TREND') {
        return `SELECT date_trunc('month', date) as month, sum(amount) as total FROM sales WHERE date >= NOW() - INTERVAL '1 year' GROUP BY 1 ORDER BY 1;`;
    }
    if (intent === 'DISTRIBUTION' && q.includes('region')) {
        return `SELECT region.name, count(customers.id) FROM customers JOIN branches ON customers.branch_id = branches.id JOIN regions ON branches.region_id = regions.id GROUP BY 1;`;
    }

    // Default safe query
    return `SELECT count(*) as total_transactions FROM transactions;`;
};

const determineCharts = (intent, data) => {
    // AI Logic to select best charts
    const charts = [];

    // Always add a Key Metric Card
    charts.push({
        type: 'kpi_card',
        title: 'Total Metric',
        value: '1,240,500', // Mock consolidated value
        change: '+12%',
        trend: 'up'
    });

    if (intent === 'TREND') {
        charts.push({
            type: 'line',
            title: 'Trend Over Time',
            xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [120, 190, 300, 500, 200, 300],
                borderColor: '#1F4FD8',
                backgroundColor: 'rgba(31, 79, 216, 0.1)'
            }]
        });
        charts.push({
            type: 'bar',
            title: 'Monthly Volume',
            xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Volume',
                data: [50, 60, 70, 80, 90, 100],
                backgroundColor: '#00D1B2'
            }]
        });
    } else if (intent === 'RANKING') {
        charts.push({
            type: 'bar',
            title: 'Top Performers',
            orientation: 'horizontal',
            xAxis: ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E'],
            datasets: [{
                label: 'Sales',
                data: [50000, 40000, 30000, 20000, 10000],
                backgroundColor: '#0B1F36'
            }]
        });
    } else {
        // Generic fallback
        charts.push({
            type: 'doughnut',
            title: 'Distribution',
            labels: ['Segment A', 'Segment B', 'Segment C'],
            datasets: [{
                data: [30, 50, 20],
                backgroundColor: ['#0B1F36', '#1F4FD8', '#00D1B2']
            }]
        });
    }

    return charts;
};

const processQuery = async (query) => {
    // 1. Detect Intent
    const intent = getIntent(query);

    // 2. Generate SQL (Mocked)
    const sql = generateSQL(query, intent);

    // 3. Execute SQL (Simulated Data for now to ensure UI works)
    // const result = await db.query(sql); 
    const mockData = []; // Replace with actual DB result

    // 4. Generate Charts
    const charts = determineCharts(intent, mockData);

    // 5. Generate Insights
    const insights = `Based on your query regarding "${query}", we found a significant ${intent.toLowerCase()} pattern. The data shows a positive trajectory in the last quarter. recommended action: Focus on underperforming regions.`;

    return {
        intent,
        sql,
        charts,
        insights,
        kpis: [
            { label: 'Total Revenue', value: '$4.2M', change: '+8.5%' },
            { label: 'Active Customers', value: '12.5K', change: '+1.2%' }
        ]
    };
};

module.exports = { processQuery };