import logging
from app.core.config import settings
from app.services.ai.base import BaseLLMProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.mock_provider import MockBackendProvider

logger = logging.getLogger("touch_grass.ai.factory")


def get_llm_provider() -> BaseLLMProvider:
    provider_type = (settings.LLM_PROVIDER or "mock").lower().strip()

    if provider_type == "gemini":
        return GeminiProvider()
    else:
        logger.info("Using MockBackendProvider (LLM_PROVIDER=%s).", provider_type)
        return MockBackendProvider()
