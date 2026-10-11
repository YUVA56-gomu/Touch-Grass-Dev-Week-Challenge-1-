from fastapi import APIRouter
from app.core.config import settings
from app.schemas.chat import HealthResponse
from app.services.ai.factory import get_llm_provider

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    provider = get_llm_provider()
    is_configured = provider.is_configured()
    status_note = (
        "API key configured. Live inference unverified until first request."
        if is_configured and not provider.is_mock
        else "Using local mock provider fallback."
    )
    return HealthResponse(
        status="ok",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        llm_provider=provider.provider_name,
        llm_configured=is_configured,
        llm_status_note=status_note,
    )
