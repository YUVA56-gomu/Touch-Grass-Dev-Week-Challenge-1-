import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
import httpx

from app.schemas.chat import ChatRequest, UserContext
from app.services.ai.mock_provider import MockBackendProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.core.config import settings


def test_mock_backend_provider():
    async def _test():
        provider = MockBackendProvider()
        assert provider.is_configured() is True
        assert provider.is_mock is True

        req = ChatRequest(message="Tell me a forest story", user_context=UserContext(friend_name="Sprout"))
        res = await provider.generate_response(req)

        assert res.is_mock is True
        assert len(res.reply_text) > 0
        assert res.expression in ["waving", "happy", "resting", "thinking", "celebrating"]

    asyncio.run(_test())


def test_gemini_provider_unconfigured_fallback():
    async def _test():
        with patch.object(settings, "GEMINI_API_KEY", ""):
            provider = GeminiProvider()
            assert provider.is_configured() is False

            req = ChatRequest(message="Hello!", user_context=UserContext(friend_name="Sprout"))
            res = await provider.generate_response(req)

            assert res.is_mock is True
            assert len(res.reply_text) > 0

    asyncio.run(_test())


def test_gemini_provider_success_mocked_httpx():
    async def _test():
        mock_gemini_json = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": "Hello friend! Welcome to the peaceful meadow. Take a deep breath of fresh air."}
                        ]
                    }
                }
            ]
        }

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_gemini_json

        mock_async_client = MagicMock()
        mock_async_client.__aenter__.return_value.post = AsyncMock(return_value=mock_response)

        with patch.object(settings, "GEMINI_API_KEY", "test_mock_api_key"):
            with patch.object(httpx, "AsyncClient", return_value=mock_async_client):
                provider = GeminiProvider()
                assert provider.is_configured() is True

                req = ChatRequest(message="Hello!", user_context=UserContext(friend_name="Sprout"))
                res = await provider.generate_response(req)

                assert res.is_mock is False
                assert "meadow" in res.reply_text
                assert res.expression == "waving"

    asyncio.run(_test())


def test_gemini_provider_http_error_fallback():
    async def _test():
        mock_response = MagicMock()
        mock_response.status_code = 500

        mock_async_client = MagicMock()
        mock_async_client.__aenter__.return_value.post = AsyncMock(return_value=mock_response)

        with patch.object(settings, "GEMINI_API_KEY", "test_mock_api_key"):
            with patch.object(httpx, "AsyncClient", return_value=mock_async_client):
                provider = GeminiProvider()

                req = ChatRequest(message="Hello!", user_context=UserContext(friend_name="Sprout"))
                res = await provider.generate_response(req)

                assert res.is_mock is True
                assert len(res.reply_text) > 0

    asyncio.run(_test())
