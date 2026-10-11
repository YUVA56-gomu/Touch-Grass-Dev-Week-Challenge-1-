import logging
from typing import Optional
import httpx

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai.base import BaseLLMProvider
from app.services.ai.mock_provider import MockBackendProvider

logger = logging.getLogger("touch_grass.ai.gemini")


class GeminiProvider(BaseLLMProvider):
    """Real LLM Provider integration using Google Gemini REST API via httpx."""

    provider_name = "Google Gemini LLM"
    is_mock = False

    def __init__(self):
        self.fallback_provider = MockBackendProvider()

    def is_configured(self) -> bool:
        return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip())

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        if not self.is_configured():
            logger.info("GEMINI_API_KEY is not configured. Falling back to MockBackendProvider.")
            return await self.fallback_provider.generate_response(request)

        friend_name = (request.user_context.friend_name if request.user_context else "Sprout") or "Sprout"

        system_instruction = (
            f"You are {friend_name}, a kind, warm 16-bit nature spirit guide. "
            f"Your mission is to help people slow down, take deep breaths, step outside, and enjoy the real world around them. "
            f"Respond warmly, concisely (2-4 sentences max), with gentle nature metaphors. "
            f"Suggest simple outdoor micro-breaks when appropriate. "
            f"Never give medical, psychiatric, or crisis advice. Keep your tone uplifting, peaceful, and grounded."
        )

        # Build contents from history + current message
        contents = []
        if request.history:
            for msg in request.history[-6:]: # Limit history context window
                role = "user" if msg.role == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg.text}]})

        contents.append({"role": "user", "parts": [{"text": request.message}]})

        payload = {
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 300,
            },
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent"

        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.post(
                    url,
                    params={"key": settings.GEMINI_API_KEY},
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )

                if response.status_code != 200:
                    logger.warning(
                        "Gemini API error (HTTP %s). Falling back to mock provider.",
                        response.status_code,
                    )
                    return await self.fallback_provider.generate_response(request)

                data = response.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    logger.warning("No candidates returned from Gemini API. Falling back to mock provider.")
                    return await self.fallback_provider.generate_response(request)

                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts or "text" not in parts[0]:
                    logger.warning("Malformed candidate parts from Gemini API. Falling back to mock provider.")
                    return await self.fallback_provider.generate_response(request)

                reply_text = parts[0]["text"].strip()
                expression = self._determine_expression(reply_text)

                return ChatResponse(
                    reply_text=reply_text,
                    expression=expression,
                    suggested_prompts=[
                        "Tell me a forest story",
                        "How can I relax right now?",
                        "Why is touching grass good for me?",
                    ],
                    audio_narration_url=None,
                    is_mock=False,
                )

        except (httpx.TimeoutException, httpx.RequestError, Exception) as exc:
            logger.warning("Gemini API call failed with exception: %s. Falling back to mock provider.", exc)
            return await self.fallback_provider.generate_response(request)

    def _determine_expression(self, text: str) -> str:
        t = text.lower()
        if any(w in t for w in ["welcome", "hello", "hi ", "greet"]):
            return "waving"
        if any(w in t for w in ["breathe", "relax", "rest", "calm", "peace"]):
            return "resting"
        if any(w in t for w in ["wonderful", "great", "celebrate", "awesome", "joy"]):
            return "celebrating"
        if any(w in t for w in ["think", "wonder", "curious", "ponder"]):
            return "thinking"
        return "happy"
