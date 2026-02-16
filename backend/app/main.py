from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Repli API",
    description="Wrapper API per Replicate.ai",
    version="0.0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Benvenuto in Repli API",
        "version": "0.0.1",
        "status": "ready"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
