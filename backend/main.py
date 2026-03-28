from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Viveris Carbone API",
    description="FastAPI backend for Viveris Carbone project",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# --- CO2 Counter Structure ---

from .co2_counter import CO2Counter, co2_counter_db

class HealthResponse(BaseModel):
    status: str
    message: str
from fastapi import Body




# Endpoint pour obtenir la valeur du compteur CO2
@app.get("/api/co2-counter", response_model=CO2Counter)
async def get_co2_counter():
    return co2_counter_db["counter"]

# Endpoint pour mettre à jour la valeur du compteur CO2
@app.post("/api/co2-counter", response_model=CO2Counter)
async def update_co2_counter(counter: CO2Counter = Body(...)):
    co2_counter_db["counter"].value = counter.value
    if counter.description:
        co2_counter_db["counter"].description = counter.description
    return co2_counter_db["counter"]


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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
