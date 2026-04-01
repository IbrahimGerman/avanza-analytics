const { OpenAI } = require('openai');
const powerBIService = require('./powerBIService');

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
You are a Senior Data Analyst for Avanza Solutions.
You have access to live Power BI metrics for the company.
Answer the user's question accurately using ONLY the provided data.
If the data does not contain the answer, say "I don't have enough data to answer that." but FIRST vigorously search through the raw nested JSON. For example, to find 'Win Rate', search for 'Win Rate', 'winRate', 'conversionRate', etc. in the properties. Look through nested objects and arrays.

Return your response strictly as a JSON object with:
- "answer": A direct, professional answer summarizing the data relevant to the query (e.g. '14.2%').
- "insights": Additional business context based on the provided metrics.
`;

const processQuery = async (query) => {
    try {
        console.log(`Processing AI query with Power BI data: ${query}`);

        let powerBIData = {};
        try {
            powerBIData = await powerBIService.fetchPowerBIData();
        } catch (err) {
            console.error("[AI Service] Failed to retrieve live Power BI Data.");
            powerBIData = {
                error: "Could not retrieve live data. Using fallback data.",
                metrics: { winRate: "14.2%", signingValue: "$1.58M", totalLeads: 646, qualifiedLeads: 412, team: [{ name: "Ahmed Khan" }, { name: "Sara Williams" }] }
            };
        }

        const promptContext = `
Here is the latest Power BI data:
${JSON.stringify(powerBIData, null, 2)}

User Question: ${query}
`;

        if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy')) {
            const completion = await openai.chat.completions.create({
                model: isOpenRouter ? "openai/gpt-3.5-turbo" : "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: promptContext }
                ],
                response_format: { type: "json_object" }
            });

            const responseData = JSON.parse(completion.choices[0].message.content);
            return {
                answer: responseData.answer || "Processing complete.",
                insights: responseData.insights || "No additional insights generated.",
                primaryData: [],
                secondaryData: [],
                distributionData: [],
                powerBIDataUsed: powerBIData
            };
        } else {
            // Fallback for missing API Key
            return {
                answer: "Mock Answer: Based on the power BI data, our win rate is 14.2% and signing value is $1.58M.",
                insights: "This is a fallback response since OpenAI API key wasn't properly configured.",
                primaryData: [],
                secondaryData: [],
                distributionData: [],
                powerBIDataUsed: powerBIData
            };
        }
    } catch (error) {
        console.error('AI Service Error:', error);
        return { answer: "Service unavailable.", insights: "An error occurred during AI processing.", primaryData: [], secondaryData: [], distributionData: [] };
    }
};

module.exports = { processQuery };
