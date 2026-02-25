
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..db.database import SessionLocal, engine, Base
from ..models import models
import faker

# Initialize Faker
fake = faker.Faker()

def init_db():
    Base.metadata.create_all(bind=engine)

def generate_data(num_sales=1000):
    db = SessionLocal()
    
    # Check if data exists
    if db.query(models.Region).count() > 0:
        print("Data already exists. Skipping generation.")
        db.close()
        return

    print("Generating Master Data...")
    
    # Regions
    regions = ["North America", "Europe", "Asia Pacific", "Latin America"]
    region_objs = []
    for r in regions:
        reg = models.Region(name=r)
        db.add(reg)
        region_objs.append(reg)
    db.commit()
    
    # Branches (5 per region)
    branch_objs = []
    for reg in region_objs:
        for _ in range(5):
            branch = models.Branch(
                name=f"{fake.city()} Branch",
                region_id=reg.id,
                location=fake.address()
            )
            db.add(branch)
            branch_objs.append(branch)
    db.commit() # Commit to get IDs
    
    # Employees (10 per branch)
    emp_objs = []
    for branch in branch_objs:
        # 1 Manager
        db.add(models.Employee(name=fake.name(), role="Manager", branch_id=branch.id))
        # 9 Sales Agents
        for _ in range(9):
            emp = models.Employee(name=fake.name(), role="Sales Agent", branch_id=branch.id)
            db.add(emp)
            emp_objs.append(emp)
    db.commit()
    
    # Products
    products = [
        {"name": "Enterprise Cloud", "cat": "Software", "price": 5000, "cost": 1000},
        {"name": "Cyber Security Suite", "cat": "Security", "price": 3000, "cost": 500},
        {"name": "AI Analytics Pro", "cat": "Software", "price": 8000, "cost": 2000},
        {"name": "Consulting Hours", "cat": "Services", "price": 200, "cost": 100},
        {"name": "Server Hardware", "cat": "Hardware", "price": 10000, "cost": 7000},
    ]
    prod_objs = []
    for p in products:
        prod = models.Product(
            name=p["name"], 
            category=p["cat"], 
            price=p["price"], 
            cost=p["cost"]
        )
        db.add(prod)
        prod_objs.append(prod)
    db.commit()

    # Customers (200)
    cust_objs = []
    for _ in range(200):
        cust = models.Customer(
            name=fake.company(),
            email=fake.company_email(),
            segment=random.choice(["Enterprise", "SMB", "Government"])
        )
        db.add(cust)
        cust_objs.append(cust)
    db.commit()

    print(f"Generating {num_sales} Sales Records... this might take a moment.")
    
    # Sales (Historical Data - Past 1 year)
    sales_batch = []
    start_date = datetime.now() - timedelta(days=365)
    
    # Reload employees with IDs
    all_employees = db.query(models.Employee).filter(models.Employee.role == "Sales Agent").all()
    all_products = db.query(models.Product).all()
    all_customers = db.query(models.Customer).all()

    for i in range(num_sales):
        sales_date = start_date + timedelta(days=random.randint(0, 365))
        product = random.choice(all_products)
        employee = random.choice(all_employees)
        customer = random.choice(all_customers)
        branch = employee.branch
        
        # Seasonality / Trend logic (simple)
        month_factor = 1.0
        if sales_date.month in [11, 12]: month_factor = 1.5 # Q4 bump
        
        qty = random.randint(1, 10)
        amt = (product.price * qty) * month_factor
        
        sale = models.Sale(
            date=sales_date,
            amount=amt,
            quantity=qty,
            branch_id=branch.id,
            employee_id=employee.id,
            product_id=product.id,
            customer_id=customer.id
        )
        sales_batch.append(sale)
        if len(sales_batch) >= 1000:
            db.bulk_save_objects(sales_batch)
            sales_batch = []
            
    if sales_batch:
        db.bulk_save_objects(sales_batch)
    db.commit()
    
    print("Generating Targets...")
    # Targets for each branch for last 12 months
    for branch in branch_objs:
        curr = start_date
        for _ in range(12):
             target = models.BranchTarget(
                 branch_id=branch.id,
                 month=curr.date().replace(day=1),
                 target_amount=random.randint(50000, 200000)
             )
             db.add(target)
             curr = curr + timedelta(days=32)
    db.commit()

    db.close()
    print("Data Generation Complete.")

if __name__ == "__main__":
    init_db()
    # Generate 10k sales for demo speed, user requested 100k but that takes too long for a single script run in prototype. 
    # Use 20k for good measure.
    generate_data(num_sales=20000) 
