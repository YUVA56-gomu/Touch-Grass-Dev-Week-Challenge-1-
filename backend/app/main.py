import sys
from pathlib import Path

# Ensure backend directory containing 'app' package is in sys.path
_file_path = Path(__file__).resolve()
_backend_dir = str(_file_path.parent.parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import health, chat, voice

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router includes
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(chat.router, prefix="/api/v1", tags=["AI Friend"])
app.include_router(voice.router, prefix="/api/v1", tags=["ElevenLabs Voice"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to TOUCH GRASS AI Gateway Proxy API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
