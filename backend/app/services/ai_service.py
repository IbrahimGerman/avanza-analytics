
import random

class AIService:
    def __init__(self):
        pass

    async def process_chat_query(self, query: str):
        """
        Mock AI processing:
        1. Intent detection
        2. SQL Generation
        3. Response formatting
        """
        query_lower = query.lower()
        
        # Simulate delay
        # await asyncio.sleep(1) 

        if "sales" in query_lower:
            return {
                "intent": "analytics_query",
                "sql": "SELECT sum(amount) FROM sales WHERE date > '2023-01-01'",
                "answer": "Total sales for the requested period are $2,450,000 based on the current projections.",
                "data_points": [{"label": "Q1", "value": 500000}, {"label": "Q2", "value": 750000}, {"label": "Q3", "value": 600000}, {"label": "Q4", "value": 600000}],
                "chart_type": "bar"
            }
        elif "revenue" in query_lower:
            return {
                "intent": "kpi_query",
                "sql": "SELECT sum(amount) FROM revenue",
                "answer": "Current revenue is tracking at 15% above target for this quarter.",
                "data_points": None,
                "chart_type": "text"
            }
        else:
            return {
                "intent": "general_chat",
                "sql": None,
                "answer": "I can help you analyze sales data, branch performance, and revenue trends. Try asking: 'Show me sales trends for last year'.",
                "data_points": None,
                "chart_type": "text"
            }

ai_service = AIService()
