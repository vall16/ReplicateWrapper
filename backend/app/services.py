from sqlalchemy.orm import Session
from app.database import User, TokenTransaction
from app.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, calculate_token_price
from datetime import timedelta
from typing import Optional

class UserService:
    @staticmethod
    def create_user(db: Session, email: str, username: str, password: str):
        """Crea un nuovo utente"""
        if db.query(User).filter(User.email == email).first():
            raise Exception("Email già registrata")
        if db.query(User).filter(User.username == username).first():
            raise Exception("Username già utilizzato")
        
        user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            tokens=0.0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        """Autentica un utente"""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def get_user(db: Session, user_id: int):
        """Recupera un utente per ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        """Recupera un utente per email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def purchase_tokens(db: Session, user_id: int, amount: float):
        """Acquista token"""
        user = UserService.get_user(db, user_id)
        if not user:
            raise Exception("Utente non trovato")
        
        user.tokens += amount
        
        # Registra la transazione
        transaction = TokenTransaction(
            user_id=user_id,
            amount=amount,
            transaction_type="purchase",
            description=f"Acquisto {amount} token"
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def consume_tokens(db: Session, user_id: int, amount: float):
        """Consuma token"""
        user = UserService.get_user(db, user_id)
        if not user:
            raise Exception("Utente non trovato")
        
        if user.tokens < amount:
            raise Exception(f"Token insufficienti. Hai {user.tokens} token, ne servono {amount}")
        
        user.tokens -= amount
        
        # Registra la transazione
        transaction = TokenTransaction(
            user_id=user_id,
            amount=-amount,
            transaction_type="consume",
            description=f"Consumo {amount} token per chiamata API"
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_transactions(db: Session, user_id: int, limit: int = 50):
        """Recupera le transazioni di un utente"""
        return db.query(TokenTransaction).filter(
            TokenTransaction.user_id == user_id
        ).order_by(TokenTransaction.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def create_auth_token(user):
        """Crea un token JWT per l'utente"""
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, 
            expires_delta=access_token_expires
        )
        return access_token
