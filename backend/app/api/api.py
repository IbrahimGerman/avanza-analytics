
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta

from ..db.database import get_db
from ..models import models
from ..services.ai_service import ai_service

router = APIRouter()

# --- Schemas ---
class ChatRequest(BaseModel):
    query: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    intent: str
    data_points: Optional[List[dict]] = None
    chart_type: Optional[str] = None

class KPIResponse(BaseModel):
    total_revenue: float
    total_sales: int
    active_branches: int
    top_product: str

class ChartDataPoint(BaseModel):
    label: str
    value: float
    category: Optional[str] = None

# --- Endpoints ---

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # In a real app, we'd pass DB context to AI service
    response = await ai_service.process_chat_query(request.query)
    return response

@router.get("/dashboard/kpi", response_model=KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    # Aggregations
    total_revenue = db.query(func.sum(models.Sale.amount)).scalar() or 0.0
    total_sales = db.query(func.count(models.Sale.id)).scalar() or 0
    active_branches = db.query(func.count(models.Branch.id)).scalar() or 0
    
    # Top Product
    top_prod = db.query(models.Product.name, func.sum(models.Sale.amount).label('revenue'))\
        .join(models.Sale)\
        .group_by(models.Product.name)\
        .order_by(func.sum(models.Sale.amount).desc())\
        .first()
        
    return {
        "total_revenue": round(total_revenue, 2),
        "total_sales": total_sales,
        "active_branches": active_branches,
        "top_product": top_prod[0] if top_prod else "N/A"
    }

@router.get("/dashboard/analytics/sales-trend", response_model=List[ChartDataPoint])
def get_sales_trend(period: str = "monthly", db: Session = Depends(get_db)):
    # Simple monthly aggregation for last 12 months
    
    # Force 365 days for now
    start_date = datetime.now() - timedelta(days=365)
    
    results = db.query(
        func.date_trunc('month', models.Sale.date).label('month'),
        func.sum(models.Sale.amount).label('total')
    ).filter(models.Sale.date >= start_date)\
    .group_by(func.date_trunc('month', models.Sale.date))\
    .order_by(func.date_trunc('month', models.Sale.date))\
    .all()
    
    data = []
    for r in results:
        data.append({
            "label": r[0].strftime("%b %Y"),
            "value": round(r[1], 2)
        })
    return data

@router.get("/dashboard/analytics/top-products", response_model=List[ChartDataPoint])
def get_top_products(limit: int = 5, db: Session = Depends(get_db)):
    results = db.query(models.Product.name, func.sum(models.Sale.amount))\
        .join(models.Sale)\
        .group_by(models.Product.name)\
        .order_by(func.sum(models.Sale.amount).desc())\
        .limit(limit)\
        .all()
        
    return [{"label": r[0], "value": round(r[1], 2)} for r in results]

@router.get("/dashboard/analytics/region-performance", response_model=List[ChartDataPoint])
def get_region_performance(db: Session = Depends(get_db)):
    results = db.query(models.Region.name, func.sum(models.Sale.amount))\
        .join(models.Branch, models.Branch.region_id == models.Region.id)\
        .join(models.Sale, models.Sale.branch_id == models.Branch.id)\
        .group_by(models.Region.name)\
        .all()
        
    return [{"label": r[0], "value": round(r[1], 2)} for r in results]
