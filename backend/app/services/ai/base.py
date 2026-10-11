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
