from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.auth_routes import router as auth_router
from app.token_routes import router as token_router

load_dotenv()

app = FastAPI(
    title="Repli API",
    description="Wrapper API per Replicate.ai con sistema token",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includi le rotte
app.include_router(auth_router)
app.include_router(token_router)

@app.get("/")
async def root():
    return {
        "message": "Benvenuto in Repli API",
        "version": "0.1.0",
        "status": "ready",
        "features": {
            "authentication": "✅",
            "token_system": "✅",
            "replicate_integration": "✅"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
