from fastapi import APIRouter
from app.core.config import settings
from app.schemas.chat import HealthResponse
from app.services.ai.factory import get_llm_provider

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    provider = get_llm_provider()
    is_configured = provider.is_configured()
    try:
        is_ready, status_note = await provider.check_readiness()
    except Exception as exc:
        is_ready = False
        status_note = f"Provider readiness check failed: {exc}"

    return HealthResponse(
        status="ok",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        llm_provider=provider.provider_name,
        llm_configured=bool(is_configured and is_ready),
        llm_status_note=status_note,
    )
