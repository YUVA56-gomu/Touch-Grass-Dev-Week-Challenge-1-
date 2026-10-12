from abc import ABC, abstractmethod
from app.schemas.chat import ChatRequest, ChatResponse


class BaseLLMProvider(ABC):
    """Abstract interface for TOUCH GRASS LLM providers."""

    provider_name: str
    is_mock: bool

    @abstractmethod
    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        """Generates a structured ChatResponse for a ChatRequest."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if valid provider credentials/keys are configured."""
        pass

    async def check_readiness(self) -> tuple[bool, str]:
        """Returns (is_ready, message) indicating live provider connectivity."""
        if self.is_configured():
            return True, f"{self.provider_name} is configured."
        return False, f"{self.provider_name} is not configured."
