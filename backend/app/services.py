from sqlalchemy.orm import Session
from sqlalchemy import update
from app.database import User, TokenTransaction
from app.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, calculate_token_price
from datetime import timedelta
from typing import Optional

class UserService:
    @staticmethod
    def create_user(db: Session, email: str, username: str, password: str):
        """Create a new user"""
        if db.query(User).filter(User.email == email).first():
            raise Exception("Email already registered")
        if db.query(User).filter(User.username == username).first():
            raise Exception("Username already taken")

        user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            tokens=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        """Authenticate a user"""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def get_user(db: Session, user_id: int):
        """Get a user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        """Get a user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def purchase_tokens(db: Session, user_id: int, amount: int, stripe_session_id: str = None):
        """Purchase tokens with Stripe session deduplication"""
        if stripe_session_id:
            exists = db.query(TokenTransaction).filter(
                TokenTransaction.stripe_session_id == stripe_session_id
            ).with_for_update().first()
            if exists:
                raise Exception(f"Session {stripe_session_id} already processed")

        user = UserService.get_user(db, user_id)
        if not user:
            raise Exception("User not found")

        user.tokens += amount

        transaction = TokenTransaction(
            user_id=user_id,
            amount=amount,
            transaction_type="purchase",
            stripe_session_id=stripe_session_id,
            description=f"Purchase of {amount} tokens"
        )

        db.add(transaction)
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(user)
        return user
    
    @staticmethod
    def consume_tokens(db: Session, user_id: int, amount: int):
        """Consume tokens atomically"""
        user = UserService.get_user(db, user_id)
        if not user:
            raise Exception("User not found")

        # Atomic update: subtract tokens only if enough remain
        result = db.execute(
            update(User)
            .where(User.id == user_id, User.tokens >= amount)
            .values(tokens=User.tokens - amount)
        )

        if result.rowcount == 0:
            current_user = UserService.get_user(db, user_id)
            raise Exception(f"❌ Insufficient tokens! You have {current_user.tokens} tokens, need {amount}")

        # Record the transaction
        transaction = TokenTransaction(
            user_id=user_id,
            amount=-amount,
            transaction_type="consume",
            description=f"Consumption of {amount} tokens for API call"
        )

        db.add(transaction)
        db.commit()

        return UserService.get_user(db, user_id)
    
    @staticmethod
    def refund_tokens(db: Session, user_id: int, amount: int):
        """Refund tokens when generation fails after consumption"""
        user = UserService.get_user(db, user_id)
        if not user:
            raise Exception("User not found")

        user.tokens += amount

        transaction = TokenTransaction(
            user_id=user_id,
            amount=amount,
            transaction_type="refund",
            description=f"Refund of {amount} tokens — generation failed after consumption"
        )

        db.add(transaction)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_transactions(db: Session, user_id: int, limit: int = 50):
        """Get a user's transactions"""
        return db.query(TokenTransaction).filter(
            TokenTransaction.user_id == user_id
        ).order_by(TokenTransaction.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def create_auth_token(user):
        """Create a JWT token for the user"""
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, 
            expires_delta=access_token_expires
        )
        return access_token
