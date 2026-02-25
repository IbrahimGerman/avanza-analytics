
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use SQLite for simplicity/prototyping if Postgres not available, 
# but prompt asked for PostgreSQL. Defaults to a local postgres instance.
# Adjust SQLALCHEMY_DATABASE_URL as needed.
# Change the password part (the text after 'postgres:') to 78640
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:78640@localhost:5432/avanza_ai_db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
