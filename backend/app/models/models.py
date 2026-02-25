
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.database import Base

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    branches = relationship("Branch", back_populates="region")

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"))
    location = Column(String)
    
    region = relationship("Region", back_populates="branches")
    employees = relationship("Employee", back_populates="branch")
    sales = relationship("Sale", back_populates="branch")
    targets = relationship("BranchTarget", back_populates="branch")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String) # Sales Agent, Manager
    branch_id = Column(Integer, ForeignKey("branches.id"))
    
    branch = relationship("Branch", back_populates="employees")
    sales = relationship("Sale", back_populates="employee")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    cost = Column(Float)
    
    sales = relationship("Sale", back_populates="product")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    segment = Column(String) # Enterprise, SMB, Retail
    
    sales = relationship("Sale", back_populates="customer")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Float)
    quantity = Column(Integer)
    
    branch_id = Column(Integer, ForeignKey("branches.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    
    branch = relationship("Branch", back_populates="sales")
    employee = relationship("Employee", back_populates="sales")
    product = relationship("Product", back_populates="sales")
    customer = relationship("Customer", back_populates="sales")

class BranchTarget(Base):
    __tablename__ = "branch_targets"
    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    month = Column(Date)
    target_amount = Column(Float)
    
    branch = relationship("Branch", back_populates="targets")

# Add more if needed like 'TimeDimension' but standard Date/DateTime covers most for now.
