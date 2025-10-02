# main.py
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

# CORS middleware - MUST be before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://10.0.0.43:3000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_origin_regex=".*",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers AFTER middleware
app.include_router(auth_router, prefix="/api/v1")
app.include_router(properties_router, prefix="/api/v1")
app.include_router(portfolios_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Real Estate Portfolio API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "real-estate-api"}