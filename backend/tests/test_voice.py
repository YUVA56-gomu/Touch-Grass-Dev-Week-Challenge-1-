import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient
import httpx

from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_get_voices_endpoint():
    response = client.get("/api/v1/voice/voices")
    assert response.status_code == 200
    data = response.json()
    assert "configured" in data
    assert "voices" in data
    assert len(data["voices"]) >= 2
    voice_ids = [v["id"] for v in data["voices"]]
    assert "sprout" in voice_ids
    assert "guardian" in voice_ids


def test_speech_unconfigured_rejection():
    with patch.object(settings, "ELEVENLABS_API_KEY", ""):
        response = client.post("/api/v1/voice/speech", json={"text": "Hello Sprout!"})
        assert response.status_code == 400
        assert "not configured" in response.json()["detail"].lower()


def test_speech_invalid_voice_rejection():
    response = client.post("/api/v1/voice/speech", json={"text": "Hello!", "voice": "unknown_voice_id"})
    assert response.status_code == 422


def test_speech_empty_text_rejection():
    response = client.post("/api/v1/voice/speech", json={"text": ""})
    assert response.status_code == 422


def test_speech_oversized_text_rejection():
    response = client.post("/api/v1/voice/speech", json={"text": "a" * 501})
    assert response.status_code == 422


def test_speech_success_mocked_httpx():
    mock_audio_content = b"fake_mp3_audio_data"
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.content = mock_audio_content

    mock_async_client = MagicMock()
    mock_async_client.__aenter__.return_value.post = AsyncMock(return_value=mock_response)

    with patch.object(settings, "ELEVENLABS_API_KEY", "test_elevenlabs_key"):
        with patch.object(httpx, "AsyncClient", return_value=mock_async_client):
            response = client.post("/api/v1/voice/speech", json={"text": "Hello Sprout!", "voice": "sprout"})
            assert response.status_code == 200
            assert response.headers["content-type"] == "audio/mpeg"
            assert response.content == mock_audio_content


def test_transcribe_unconfigured_rejection():
    with patch.object(settings, "ELEVENLABS_API_KEY", ""):
        files = {"file": ("test.webm", b"dummy audio content", "audio/webm")}
        response = client.post("/api/v1/voice/transcribe", files=files)
        assert response.status_code == 400


def test_transcribe_unsupported_media_type():
    with patch.object(settings, "ELEVENLABS_API_KEY", "test_elevenlabs_key"):
        files = {"file": ("test.txt", b"not audio data", "text/plain")}
        response = client.post("/api/v1/voice/transcribe", files=files)
        assert response.status_code == 415


def test_transcribe_empty_file_rejection():
    with patch.object(settings, "ELEVENLABS_API_KEY", "test_elevenlabs_key"):
        files = {"file": ("test.webm", b"", "audio/webm")}
        response = client.post("/api/v1/voice/transcribe", files=files)
        assert response.status_code == 400


def test_transcribe_success_mocked_httpx():
    mock_stt_json = {"text": "Hello Sprout, how are you today?"}
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_stt_json

    mock_async_client = MagicMock()
    mock_async_client.__aenter__.return_value.post = AsyncMock(return_value=mock_response)

    with patch.object(settings, "ELEVENLABS_API_KEY", "test_elevenlabs_key"):
        with patch.object(httpx, "AsyncClient", return_value=mock_async_client):
            files = {"file": ("audio.webm", b"fake_audio_bytes", "audio/webm")}
            response = client.post("/api/v1/voice/transcribe", files=files)
            assert response.status_code == 200
            data = response.json()
            assert data["text"] == "Hello Sprout, how are you today?"
