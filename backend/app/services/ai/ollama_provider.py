import logging
import time
from typing import List, Optional
import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai.base import BaseLLMProvider

logger = logging.getLogger("touch_grass.ai.ollama")


class OllamaProvider(BaseLLMProvider):
    """
    Local LLM Provider integration using Ollama REST API (Gemma 2 2B).
    Operates on-device via http://localhost:11434 without sending private data to cloud services.
    """

    is_mock = False

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ):
        raw_url = base_url if base_url is not None else settings.OLLAMA_BASE_URL
        self.base_url = raw_url.rstrip("/") if raw_url else ""
        self.model = model if model is not None else settings.OLLAMA_MODEL
        self.timeout = timeout if timeout is not None else settings.OLLAMA_TIMEOUT_SECONDS
        self.provider_name = f"Ollama Local Gemma ({self.model})" if self.model else "Ollama Local Gemma"

    def is_configured(self) -> bool:
        """Returns True if base_url and model name are configured."""
        return bool(self.base_url and self.model)

    async def check_readiness(self) -> tuple[bool, str]:
        """
        Verifies that the Ollama service is reachable and the requested model is installed.
        Returns (is_ready, message).
        """
        if not self.is_configured():
            return False, "Ollama configuration is missing base URL or model name."

        tags_url = f"{self.base_url}/api/tags"
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                response = await client.get(tags_url)
                if response.status_code != 200:
                    return False, f"Ollama service returned unexpected status HTTP {response.status_code} at {tags_url}."

                data = response.json()
                models = data.get("models", [])
                installed_names = [m.get("name", "") for m in models] + [m.get("model", "") for m in models]

                # Check exact match or prefix match (e.g. 'gemma2:2b')
                target = self.model.lower().strip()
                match = any(target == name.lower().strip() or name.lower().startswith(f"{target}:") for name in installed_names if name)

                if match:
                    return True, f"Ollama service is active and model '{self.model}' is installed and ready for local inference."
                else:
                    installed_list = ", ".join(sorted(set(filter(None, installed_names)))) or "none"
                    return (
                        False,
                        f"Model '{self.model}' is not installed in Ollama at {self.base_url}. "
                        f"Available models: [{installed_list}]. Run `ollama pull {self.model}` to download it.",
                    )

        except (httpx.ConnectError, httpx.ConnectTimeout):
            return (
                False,
                f"Ollama service is not reachable at {self.base_url}. "
                "Please make sure Ollama is installed and running (`ollama serve`).",
            )
        except Exception as exc:
            return False, f"Ollama readiness check failed: {str(exc)}"

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        """
        Generates a structured ChatResponse using local Ollama chat API.
        Never silently falls back to hosted or mock providers when Ollama fails.
        """
        friend_name = (request.user_context.friend_name if request.user_context else "Sprout") or "Sprout"

        # Dedicated Sprout nature-companion system instruction
        system_instruction = (
            f"You are {friend_name}, a friendly, energetic, and supportive 16-bit nature companion spirit in TOUCH GRASS. "
            f"Your role is to help the user reconnect with nature, take mindful pauses, and recharge outdoors. "
            f"Be warm, encouraging, and nature-focused. "
            f"Keep responses concise (typically 2 to 4 sentences max) with gentle metaphors. "
            f"Encourage real-world outdoor activities, fresh air, and looking away from screens, "
            f"but NEVER shame or pressure the user for staying inside or being busy. Meet them where they are with positivity. "
            f"Do not give medical, psychological, or crisis advice. Keep your tone cheerful, peaceful, and grounded."
        )

        # Build multi-turn context (ephemeral, not persisted to disk or server DB)
        messages = [{"role": "system", "content": system_instruction}]

        if request.history:
            for msg in request.history[-8:]:
                role = "user" if msg.role == "user" else "assistant"
                messages.append({"role": role, "content": msg.text})

        messages.append({"role": "user", "content": request.message})

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 256,
            },
        }

        chat_url = f"{self.base_url}/api/chat"
        start_time = time.perf_counter()

        logger.info(
            "[AI-DIAGNOSTIC] Request started | Provider: %s | Model: %s | HistoryTurns: %d",
            self.provider_name,
            self.model,
            len(request.history) if request.history else 0,
        )

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    chat_url,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )

                if response.status_code == 404:
                    elapsed_ms = (time.perf_counter() - start_time) * 1000
                    logger.warning(
                        "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Status: 404 | Latency: %.1fms | Error: ModelNotFound",
                        self.provider_name,
                        self.model,
                        elapsed_ms,
                    )
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail=(
                            f"Ollama local inference failed: Model '{self.model}' was not found at {self.base_url}. "
                            f"Please run `ollama pull {self.model}` in your terminal."
                        ),
                    )

                if response.status_code != 200:
                    elapsed_ms = (time.perf_counter() - start_time) * 1000
                    logger.warning(
                        "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Status: %d | Latency: %.1fms | Error: BadStatus",
                        self.provider_name,
                        self.model,
                        response.status_code,
                        elapsed_ms,
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"Ollama service returned HTTP {response.status_code}: {response.text}",
                    )

                data = response.json()
                msg = data.get("message")
                if not msg or "content" not in msg:
                    elapsed_ms = (time.perf_counter() - start_time) * 1000
                    logger.warning(
                        "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Latency: %.1fms | Error: MalformedResponse",
                        self.provider_name,
                        self.model,
                        elapsed_ms,
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Ollama response was malformed: missing message content.",
                    )

                reply_text = msg["content"].strip()
                if not reply_text:
                    elapsed_ms = (time.perf_counter() - start_time) * 1000
                    logger.warning(
                        "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Latency: %.1fms | Error: EmptyResponse",
                        self.provider_name,
                        self.model,
                        elapsed_ms,
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Ollama returned an empty response.",
                    )

                elapsed_ms = (time.perf_counter() - start_time) * 1000
                logger.info(
                    "[AI-DIAGNOSTIC] Request completed | Provider: %s | Model: %s | Status: 200 | Latency: %.1fms | ResponseChars: %d | IsMock: False",
                    self.provider_name,
                    self.model,
                    elapsed_ms,
                    len(reply_text),
                )

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
                    provider_name=self.provider_name,
                )

        except (httpx.ConnectError, httpx.ConnectTimeout) as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            logger.warning(
                "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Latency: %.1fms | Error: ConnectError",
                self.provider_name,
                self.model,
                elapsed_ms,
            )
            logger.error("Failed to connect to Ollama service at %s: %s", chat_url, exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    f"Ollama service is not reachable at {self.base_url}. "
                    "Please ensure Ollama is installed and running (`ollama serve` or Ollama desktop app)."
                ),
            )
        except httpx.TimeoutException as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            logger.warning(
                "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Latency: %.1fms | Error: TimeoutException",
                self.provider_name,
                self.model,
                elapsed_ms,
            )
            logger.error("Ollama request timed out after %ss: %s", self.timeout, exc)
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Ollama local inference timed out after {self.timeout}s while generating response with model '{self.model}'.",
            )
        except HTTPException:
            raise
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            logger.warning(
                "[AI-DIAGNOSTIC] Request failed | Provider: %s | Model: %s | Latency: %.1fms | Error: %s",
                self.provider_name,
                self.model,
                elapsed_ms,
                type(exc).__name__,
            )
            logger.error("Unexpected error during Ollama inference: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error during Ollama local inference: {str(exc)}",
            )

    def _determine_expression(self, text: str) -> str:
        t = text.lower()
        if any(w in t for w in ["welcome", "hello", "hi ", "greet", "glad to see you"]):
            return "waving"
        if any(w in t for w in ["breathe", "relax", "rest", "calm", "peace", "pause", "slow down"]):
            return "resting"
        if any(w in t for w in ["wonderful", "great", "celebrate", "awesome", "joy", "proud", "yay"]):
            return "celebrating"
        if any(w in t for w in ["think", "wonder", "curious", "ponder", "notice", "observe"]):
            return "thinking"
        return "happy"
