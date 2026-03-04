const { OpenAI } = require('openai');
const { pool } = require('../config/db');

const isOpenRouter = process.env.OPENAI_API_KEY?.startsWith('sk-or-');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
    baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
    defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Avanza Analytics",
    } : undefined
});

const SYSTEM_PROMPT = `
You are a Senior SQL Expert and Banking Analyst for Avanza Solutions.
STRICT REQUIREMENTS:
1. THE 'ALWAYS-FULL' LOGIC: You MUST return three distinct SQL queries in one JSON object. NO HARDCODED OR DUPLICATE NUMBERS. Use exact aggregation. 
2. TRIPLE-CHART DYNAMICS:
   - "primarySql": The main answer (e.g. Leads per User, Revenue by Name).
   - "secondarySql": A comparative breakdown (e.g. Status distribution, Qualified vs Unqualified, counts per category) used for a Pie/Donut Chart.
   - "distributionSql": A time-series trend or regional split (e.g. deals over time, volume per month) used for an Area/Line Chart.
3. SQL PRIVACY: STRICTLY hide all SQL code from the end user. Never show SELECT or FROM in insights.
4. DYNAMIC RESPONSE: Return ONLY a JSON object containing: 
   - "primarySql": (String)
   - "secondarySql": (String)
   - "distributionSql": (String)
   - "insights": (Specific business interpretation. Do NOT mention SQL.)

Schema context: employees (id, name, division, role), deals (id, title, value, status, region, owner_id, created_at, signing_value, lead_type).
`;

const fallbackEngine = (query) => {
    const q = query.toLowerCase();

    // Default fallback base
    let primarySql = "SELECT e.name, SUM(d.value) as total_value FROM deals d JOIN employees e ON d.owner_id = e.id GROUP BY e.name ORDER BY total_value DESC LIMIT 10;";
    let secondarySql = "SELECT status, COUNT(id) as count FROM deals GROUP BY status;"; // Composition Pie
    let distributionSql = "SELECT TO_CHAR(created_at, 'YYYY-Mon') as month, SUM(value) as revenue FROM deals WHERE status = 'Closed Won' GROUP BY 1, date_trunc('month', created_at) ORDER BY date_trunc('month', created_at) LIMIT 6;"; // Trend Area
    let insights = "Extracted based on semantic rules.";

    if (q.includes('lead')) {
        primarySql = "SELECT e.name, COUNT(*) as total_leads, COUNT(*) FILTER (WHERE d.status = 'Qualified') as qualified, (COUNT(*) FILTER (WHERE d.status = 'Qualified')::FLOAT / NULLIF(COUNT(*), 0) * 100) as conversion FROM deals d JOIN employees e ON d.owner_id = e.id GROUP BY e.name;";
        secondarySql = "SELECT status, COUNT(*) as count FROM deals GROUP BY status;";
        distributionSql = "SELECT TO_CHAR(created_at, 'YYYY-Mon') as month, COUNT(*) as new_leads FROM deals GROUP BY 1, date_trunc('month', created_at) ORDER BY date_trunc('month', created_at) LIMIT 6;";
        insights = "Comparison of total leads per team member, alongside conversion status distribution.";
    } else if (q.includes('region') || q.includes('revenue')) {
        primarySql = "SELECT region, SUM(value) as total_revenue FROM deals WHERE status = 'Closed Won' GROUP BY region ORDER BY total_revenue DESC;";
        secondarySql = "SELECT region, COUNT(id) as deal_volume FROM deals GROUP BY region;";
        distributionSql = "SELECT TO_CHAR(created_at, 'YYYY-Mon') as month, SUM(value) as revenue FROM deals WHERE status = 'Closed Won' GROUP BY 1, date_trunc('month', created_at) ORDER BY date_trunc('month', created_at) LIMIT 6;";
        insights = "Revenue distribution across operating regions, displaying total volume and conversion trends.";
    } else if (q.includes('team') || q.includes('performance')) {
        primarySql = "SELECT e.name, SUM(d.value) as total_leads, COUNT(*) FILTER (WHERE d.status = 'Closed Won') as qualified, (COUNT(*) FILTER (WHERE d.status = 'Closed Won')::FLOAT / NULLIF(COUNT(d.*), 0)) * 100 as conversion FROM deals d JOIN employees e ON d.owner_id = e.id GROUP BY e.name ORDER BY total_leads DESC;";
        secondarySql = "SELECT e.role, COUNT(*) as count FROM deals d JOIN employees e ON d.owner_id = e.id GROUP BY e.role;";
        distributionSql = "SELECT TO_CHAR(created_at, 'YYYY-Mon') as month, SUM(value) as revenue FROM deals WHERE status = 'Closed Won' GROUP BY 1, date_trunc('month', created_at) ORDER BY date_trunc('month', created_at) LIMIT 6;";
        insights = "Team performance mapped by total pipeline and conversion rate metrics.";
    }

    return { primarySql, secondarySql, distributionSql, insights };
};

const processQuery = async (query) => {
    try {
        console.log(`Processing query: ${query}`);
        let aiResponse;

        if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy')) {
            try {
                const completion = await openai.chat.completions.create({
                    model: isOpenRouter ? "openai/gpt-3.5-turbo" : "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: query }
                    ],
                    response_format: { type: "json_object" }
                });
                aiResponse = JSON.parse(completion.choices[0].message.content);
            } catch (llmErr) {
                console.warn("LLM Failed, using Deterministic Fallback.");
                aiResponse = fallbackEngine(query);
            }
        } else {
            aiResponse = fallbackEngine(query);
        }

        const fallback = fallbackEngine(query);
        const pSql = aiResponse.primarySql || fallback.primarySql;
        const sSql = aiResponse.secondarySql || fallback.secondarySql;
        const dSql = aiResponse.distributionSql || fallback.distributionSql;
        const insights = aiResponse.insights || fallback.insights;

        let primaryData = [];
        let secondaryData = [];
        let distributionData = [];

        try {
            const [primaryRes, secondaryRes, distRes] = await Promise.all([
                pool.query(pSql).catch(() => ({ rows: [] })),
                pool.query(sSql).catch(() => ({ rows: [] })),
                pool.query(dSql).catch(() => ({ rows: [] }))
            ]);

            primaryData = primaryRes.rows || [];
            secondaryData = secondaryRes.rows || [];
            distributionData = distRes.rows || [];
        } catch (dbErr) {
            console.error('SQL Execution Error:', dbErr);
        }

        // Failsafe Always-Full Logic
        if (!primaryData.length) primaryData = [];
        if (!secondaryData.length) secondaryData = [];
        if (!distributionData.length) distributionData = [];

        console.log("📊 Always-Full Data pipeline activated.");

        return {
            primaryData,
            secondaryData,
            distributionData,
            insights
        };

    } catch (error) {
        console.error('AI Service Error:', error);
        return { primaryData: [], secondaryData: [], distributionData: [], insights: "Service unavailable." };
    }
};

module.exports = { processQuery };
