
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api
from .db.database import engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Avanza AI Analytics Platform",
    description="Enterprise BI & AI Chat Backend",
    version="1.0.0"
)

# CORS (Allow all for prototype)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Avanza AI Analytics Platform API is running."}
