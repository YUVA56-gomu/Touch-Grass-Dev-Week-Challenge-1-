import pytest
import httpx
from fastapi import HTTPException

from app.schemas.chat import ChatMessage, ChatRequest, UserContext
from app.services.ai.ollama_provider import OllamaProvider


@pytest.mark.asyncio
async def test_ollama_provider_configuration():
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")
    assert provider.is_configured() is True
    assert provider.is_mock is False
    assert "gemma2:2b" in provider.provider_name

    unconfigured = OllamaProvider(base_url="", model="")
    assert unconfigured.is_configured() is False


@pytest.mark.asyncio
async def test_ollama_successful_chat_response(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    mock_ollama_response = {
        "model": "gemma2:2b",
        "created_at": "2026-10-11T12:00:00Z",
        "message": {
            "role": "assistant",
            "content": "Hello friend! Take a gentle deep breath and listen to the leaves rustling outside. How are you feeling today?",
        },
        "done": True,
    }

    captured_payload = {}

    async def mock_post(self, url, **kwargs):
        nonlocal captured_payload
        captured_payload = kwargs.get("json", {})
        return httpx.Response(
            status_code=200,
            json=mock_ollama_response,
            request=httpx.Request("POST", url),
        )

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    request = ChatRequest(
        session_id="test_session",
        message="I'm feeling a bit tired from working at my desk.",
        history=[
            ChatMessage(role="user", text="Hi Sprout!"),
            ChatMessage(role="assistant", text="Welcome to the forest!"),
        ],
        user_context=UserContext(friend_name="Sprout"),
    )

    response = await provider.generate_response(request)

    # Verification of response payload
    assert response.is_mock is False
    assert response.reply_text == mock_ollama_response["message"]["content"]
    assert response.provider_name == "Ollama Local Gemma (gemma2:2b)"
    assert response.expression in ["happy", "resting", "thinking", "waving", "celebrating"]
    assert len(response.suggested_prompts) > 0

    # Verification of multi-turn payload sent to Ollama
    assert captured_payload["model"] == "gemma2:2b"
    assert captured_payload["stream"] is False
    messages = captured_payload["messages"]

    # First message must be the Sprout nature-companion system prompt
    assert messages[0]["role"] == "system"
    assert "Sprout" in messages[0]["content"]
    assert "never shame or pressure" in messages[0]["content"].lower()

    # Preserves history turns in order
    assert messages[1]["role"] == "user"
    assert messages[1]["content"] == "Hi Sprout!"
    assert messages[2]["role"] == "assistant"
    assert messages[2]["content"] == "Welcome to the forest!"

    # Final message is current prompt
    assert messages[3]["role"] == "user"
    assert messages[3]["content"] == "I'm feeling a bit tired from working at my desk."


@pytest.mark.asyncio
async def test_ollama_service_unavailable_connection_error(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_post_conn_err(self, url, **kwargs):
        raise httpx.ConnectError("Connection refused by localhost:11434")

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post_conn_err)

    request = ChatRequest(
        session_id="test_session",
        message="Can you hear me?",
    )

    # Must raise 503 and NEVER silently fall back to mock or hosted provider
    with pytest.raises(HTTPException) as exc_info:
        await provider.generate_response(request)

    assert exc_info.value.status_code == 503
    assert "Ollama service is not reachable" in exc_info.value.detail
    assert "ollama serve" in exc_info.value.detail


@pytest.mark.asyncio
async def test_ollama_model_missing_404(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_post_404(self, url, **kwargs):
        return httpx.Response(
            status_code=404,
            text='{"error": "model gemma2:2b not found"}',
            request=httpx.Request("POST", url),
        )

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post_404)

    request = ChatRequest(session_id="test_session", message="Hello!")

    with pytest.raises(HTTPException) as exc_info:
        await provider.generate_response(request)

    assert exc_info.value.status_code == 503
    assert "model 'gemma2:2b' was not found" in exc_info.value.detail.lower()
    assert "ollama pull gemma2:2b" in exc_info.value.detail


@pytest.mark.asyncio
async def test_ollama_timeout(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b", timeout=5.0)

    async def mock_post_timeout(self, url, **kwargs):
        raise httpx.TimeoutException("Request timed out after 5.0 seconds")

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post_timeout)

    request = ChatRequest(session_id="test_session", message="Take your time.")

    with pytest.raises(HTTPException) as exc_info:
        await provider.generate_response(request)

    assert exc_info.value.status_code == 504
    assert "timed out after 5.0s" in exc_info.value.detail


@pytest.mark.asyncio
async def test_ollama_malformed_response(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_post_malformed(self, url, **kwargs):
        return httpx.Response(
            status_code=200,
            json={"unexpected_field": 123},
            request=httpx.Request("POST", url),
        )

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post_malformed)

    request = ChatRequest(session_id="test_session", message="Hello?")

    with pytest.raises(HTTPException) as exc_info:
        await provider.generate_response(request)

    assert exc_info.value.status_code == 502
    assert "malformed" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_ollama_readiness_check_success(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_get_tags(self, url, **kwargs):
        return httpx.Response(
            status_code=200,
            json={"models": [{"name": "gemma2:2b", "model": "gemma2:2b"}]},
            request=httpx.Request("GET", url),
        )

    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get_tags)

    is_ready, note = await provider.check_readiness()
    assert is_ready is True
    assert "ready for local inference" in note


@pytest.mark.asyncio
async def test_ollama_readiness_check_missing_model(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_get_tags(self, url, **kwargs):
        return httpx.Response(
            status_code=200,
            json={"models": [{"name": "llama3.1:8b"}]},
            request=httpx.Request("GET", url),
        )

    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get_tags)

    is_ready, note = await provider.check_readiness()
    assert is_ready is False
    assert "ollama pull gemma2:2b" in note


@pytest.mark.asyncio
async def test_ollama_readiness_check_connection_error(monkeypatch):
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_get_conn_err(self, url, **kwargs):
        raise httpx.ConnectError("Service down")

    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get_conn_err)

    is_ready, note = await provider.check_readiness()
    assert is_ready is False
    assert "ollama serve" in note


@pytest.mark.asyncio
async def test_ollama_no_silent_fallback_guarantee(monkeypatch):
    """Verifies that failures never get caught to return mock responses."""
    provider = OllamaProvider(base_url="http://localhost:11434", model="gemma2:2b")

    async def mock_failure(self, url, **kwargs):
        raise httpx.RequestError("Network glitch")

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_failure)

    request = ChatRequest(session_id="s1", message="Help me")

    with pytest.raises(HTTPException):
        response = await provider.generate_response(request)
        # Should never reach here
        assert False, "Provider should have raised an exception instead of returning a response"
