from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy import ForeignKey, create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.orm import Session

from datetime import datetime
import os
import time
from dotenv import load_dotenv
load_dotenv()  # legge il .env nella root

# Database setup
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./repli.db")
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost/repli_db")

for i in range(10):  # prova 10 volte
    try:
        engine = create_engine(DATABASE_URL)
        # prova una connessione veloce
        conn = engine.connect()
        conn.close()
        print("DB pronto!")
        break
    except Exception as e:
        print("DB non pronto, retry in 3s...")
        time.sleep(3)
else:
    raise Exception("Impossibile connettersi al DB")

# engine = create_engine(
#     DATABASE_URL,
#     connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
# )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    tokens = Column(Float, default=0.0)  # Saldo token
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relazioni
    logins = relationship("Login", back_populates="user")
    transactions = relationship("TokenTransaction", back_populates="user")


class Login(Base):
    __tablename__ = "logins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ip_address = Column(String(100))
    user_agent = Column(String(255))
    login_time = Column(DateTime, default=datetime.utcnow)
    logout_time = Column(DateTime, nullable=True)
    success = Column(Boolean, default=True)

    user = relationship("User", back_populates="logins")


class TokenTransaction(Base):
    __tablename__ = "token_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    transaction_type = Column(String(50))  # "purchase", "consume"
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")


# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

