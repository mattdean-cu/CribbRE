# main.py
# Updated FastAPI app with property management and portfolio folder endpoints

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings
from app.api.auth import router as auth_router
from app.api.properties import router as properties_router
from app.api.portfolios import router as portfolios_router

app = FastAPI(
    title="Real Estate Portfolio API",
    description="Real Estate Simulation & Portfolio Management App",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(properties_router, prefix="/api/v1")
app.include_router(portfolios_router, prefix="/api/v1")  # New portfolio folder routes

@app.get("/")
async def root():
    return {"message": "Real Estate Portfolio API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "real-estate-api"}