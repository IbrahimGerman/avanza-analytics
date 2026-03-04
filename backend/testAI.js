
require('dotenv').config();
const aiService = require('./src/services/aiService');

const testQueries = [
    "Show total revenue for 2026",
    "What is the total count of all deals?",
    "Show revenue broken down by region",
    "Show leads per member for the Presales team",
    "Compare the performance of Priya and Ahmed",
    "Show the top 5 deals by signing value"
];

const runTests = async () => {
    for (const q of testQueries) {
        console.log(`\n--- Testing Query: "${q}" ---`);
        try {
            const result = await aiService.processQuery(q);
            console.log(`SQL: ${result.sql}`);
            console.log(`Summary: ${result.insights}`);
            console.log(`KPIs:`, result.kpis);
            if (result.charts.length > 0) {
                console.log(`Chart: ${result.charts[0].type} - ${result.charts[0].title}`);
            }
        } catch (err) {
            console.error(`Error testing "${q}":`, err.message);
        }
    }
    process.exit(0);
};

runTests();
