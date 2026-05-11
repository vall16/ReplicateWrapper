from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy import ForeignKey, create_engine, Column, Integer, String, Float, DateTime, Boolean, CheckConstraint
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
        print("DB ready!")
        break
    except Exception as e:
        print("DB ERROR:", str(e))
        print("DB not ready, retry in 3s...")
        time.sleep(3)
else:
    raise Exception("Unable to connect to DB")

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
    tokens = Column(Integer, default=0, nullable=False)  # Saldo token
    is_active = Column(Boolean, default=True)
    __table_args__ = (
        CheckConstraint('tokens >= 0', name='ck_tokens_non_negative'),
    )
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
    amount = Column(Integer)
    transaction_type = Column(String(50))  # "purchase", "consume"
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

class GeneratedImage(Base):
    __tablename__ = "generated_images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    prompt = Column(String(500))
    model = Column(String(100))
    style = Column(String(100))

    image_url = Column(String(500))

    tokens_used = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    # relazione opzionale
    user = relationship("User")


class GeneratedVideo(Base):
    __tablename__ = "generated_videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    prompt = Column(String(500))
    model = Column(String(100))
    resolution = Column(String(50))  # "480p", "720p"
    duration = Column(Integer)  # 5, 10, 30, 60 secondi

    video_url = Column(String(500))

    tokens_used = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    # relazione opzionale
    user = relationship("User")


# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

