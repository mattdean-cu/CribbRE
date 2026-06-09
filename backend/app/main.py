# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.settings import settings
from app.core.limiter import limiter
from app.api.auth import router as auth_router
from app.api.properties import router as properties_router
from app.api.portfolios import router as portfolios_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"🚀 Starting {settings.APP_NAME}")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🌐 Allowed CORS Origins: {settings.cors_origins}")
    print(f"🔗 Frontend URL: {settings.FRONTEND_URL}")
    if settings.is_production:
        print("⚠️  Running in PRODUCTION mode")
    else:
        print("🔧 Running in DEVELOPMENT mode")

    yield

    # Shutdown (if you need cleanup later)
    print("👋 Shutting down...")


app = FastAPI(
    title="Cribb Real Estate Management API",
    description="Real Estate Simulation & Portfolio Management App",
    version="1.0.0",
    debug=settings.DEBUG,
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS middleware - Now uses settings for flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # Uses environment-based origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(properties_router, prefix="/api/v1")
app.include_router(portfolios_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Cribb Real Estate Management API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "cribb-real-estate-api",
        "environment": settings.ENVIRONMENT
    }