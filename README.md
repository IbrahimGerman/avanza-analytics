# Enterprise AI Conversational Analytics Platform

## Project Overview
This is a full-stack application that provides natural language analytics over an enterprise PostgreSQL database.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, PostgreSQL, OpenAI API (or Mock)
- **Database**: PostgreSQL (Enterprise Schema)

## Setup Instructions

### 1. Database Setup
Ensure you have PostgreSQL installed and running.
Create a database named `ai_analytics_db`.
Run the SQL scripts in `database/`:
```bash
psql -U your_user -d ai_analytics_db -f database/schema.sql
psql -U your_user -d ai_analytics_db -f database/seed.sql
```

### 2. Backend Setup
Navigate to `backend/`:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials and OpenAI Key
npm run dev
```

### 3. Frontend Setup
Navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```

## Folder Structure
```
ai-analytics-platform/
├── backend/
│   ├── src/
│   │   ├── config/ (DB config)
│   │   ├── controllers/ (Request handling)
│   │   ├── services/ (AI & SQL Logic)
│   │   ├── routes/ (API endpoints)
│   │   └── index.js (Entry point)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── ChartRenderer.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
└── database/
    ├── schema.sql
    └── seed.sql
```

## API Documentation

### POST /api/chat
**Body:**
```json
{
  "message": "Show total sales by region"
}
```

**Response:**
```json
{
  "type": "analysis",
  "data": [ ...rows... ],
  "meta": {
    "sql": "SELECT ...",
    "chartType": "bar",
    "title": "Total Sales by Region",
    "summary": "..."
  }
}
```
