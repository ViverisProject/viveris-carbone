from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load .env for backwards compatibility
load_dotenv()

# Attempt to import centralized config if available; fall back to environment variables
try:
    from config import ALLOWED_ORIGINS as CONFIG_ALLOWED_ORIGINS, PORT as CONFIG_PORT
except Exception:
    CONFIG_ALLOWED_ORIGINS = None
    CONFIG_PORT = None

app = FastAPI(
    title="Viveris Carbone API",
    description="FastAPI backend for Viveris Carbone project",
    version="1.0.0"
)

# CORS configuration
if CONFIG_ALLOWED_ORIGINS is not None:
    origins = CONFIG_ALLOWED_ORIGINS
else:
    origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    message: str


class MessageResponse(BaseModel):
    message: str


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "message": "Viveris Carbone API is running"
    }


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Backend is operational"
    }


@app.get("/api/hello", response_model=MessageResponse)
async def hello_world():
    """Hello world endpoint"""
    return {"message": "Hello from FastAPI backend!"}


if __name__ == "__main__":
    import uvicorn
    port = int(CONFIG_PORT or os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
