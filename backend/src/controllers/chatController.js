// src/controllers/chatController.js
const db = require('../config/db');
const aiService = require('../services/aiService');

const processQuery = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // 1. Get SQL from AI
        const aiResponse = await aiService.generateSQL(message);

        if (!aiResponse.sql) {
            return res.json({
                type: 'text',
                content: aiResponse.error || "I couldn't understand that request."
            });
        }

        console.log(`Executing SQL: ${aiResponse.sql}`);

        // 2. Execute SQL
        // simple safety check - read only
        if (!aiResponse.sql.trim().toLowerCase().startsWith('select')) {
            return res.status(403).json({ error: 'Only SELECT queries are allowed for safety.' });
        }

        const result = await db.query(aiResponse.sql);

        // 3. Generate Insight based on real data
        const insight = await aiService.generateInsight(message, result.rows, aiResponse.sql);

        // 4. Return formatted response
        res.json({
            type: 'analysis',
            data: result.rows,
            meta: {
                sql: aiResponse.sql,
                chartType: aiResponse.chartType,
                title: insight.title,    // Dynamic title
                summary: insight.summary // Dynamic Executive Memo
            }
        });

    } catch (error) {
        console.error('Query Processing Error:', error);
        // Strict Requirement: Output exact SQL error
        res.status(500).json({
            type: 'text',
            content: `System Error: ${error.message}`,
            error: error.message
        });
    }
};

module.exports = { processQuery };
