import logging
from typing import List
import httpx

from app.core.config import settings
from app.schemas.voice import VoiceProfile

logger = logging.getLogger("touch_grass.voice.elevenlabs")


class ElevenLabsService:
    """Backend service for ElevenLabs Text-to-Speech and Speech-to-Text APIs."""

    def is_configured(self) -> bool:
        key = (settings.ELEVENLABS_API_KEY or "").strip()
        if not key:
            return False
        # Valid ElevenLabs secret API keys start with 'sk_'.
        # Non-secret keys (such as 64-hex Key IDs) cannot authenticate and cause 401 errors.
        # Allow 'test_' prefix for test suite mocks.
        return key.startswith("sk_") or key.startswith("test_")

    def get_voice_profiles(self) -> List[VoiceProfile]:
        return [
            VoiceProfile(
                id="sprout",
                name="Sprout",
                description="Warm, friendly, gentle, 16-bit nature spirit guide.",
            ),
            VoiceProfile(
                id="guardian",
                name="Forest Guardian",
                description="Calm, lower-pitched, thoughtful nature story narrator.",
            ),
        ]

    def _get_voice_id(self, profile: str) -> str:
        if profile.lower() == "guardian":
            return settings.ELEVENLABS_GUARDIAN_VOICE_ID or "AZnzlk1XvdvUeBnXmlld"
        return settings.ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM"

    async def generate_speech(self, text: str, voice_profile: str = "sprout") -> bytes:
        if not self.is_configured():
            raise ValueError("ElevenLabs API key is not configured on the server.")

        voice_id = self._get_voice_id(voice_profile)
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        headers = {
            "xi-api-key": settings.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }

        payload = {
            "text": text,
            "model_id": settings.ELEVENLABS_TTS_MODEL,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.post(url, headers=headers, json=payload)

                if response.status_code != 200:
                    try:
                        err_body = response.json()
                        detail_msg = err_body.get("detail", {})
                        if isinstance(detail_msg, dict) and detail_msg.get("code") == "invalid_api_key":
                            raise ValueError(
                                "ElevenLabs API Key Error: The key configured in backend/.env is an API Key ID. "
                                "ElevenLabs secret API keys start with 'sk_'."
                            )
                    except ValueError:
                        raise
                    except Exception:
                        pass

                    err_msg = response.text.replace(settings.ELEVENLABS_API_KEY, "[REDACTED]") if settings.ELEVENLABS_API_KEY else response.text
                    logger.warning("ElevenLabs TTS error (HTTP %s): %s", response.status_code, err_msg)
                    raise RuntimeError(f"ElevenLabs TTS failed with HTTP {response.status_code}: {err_msg}")

                return response.content

        except ValueError:
            raise
        except (httpx.TimeoutException, httpx.RequestError) as exc:
            logger.warning("ElevenLabs TTS network error: %s", exc)
            raise RuntimeError("ElevenLabs TTS request timed out or network failed.")

    async def transcribe_audio(
        self, audio_bytes: bytes, filename: str = "audio.webm", content_type: str = "audio/webm"
    ) -> str:
        if not self.is_configured():
            raise ValueError("ElevenLabs API key is not configured on the server.")

        url = "https://api.elevenlabs.io/v1/speech-to-text"
        headers = {
            "xi-api-key": settings.ELEVENLABS_API_KEY,
        }

        files = {
            "file": (filename, audio_bytes, content_type),
        }
        data = {
            "model_id": settings.ELEVENLABS_STT_MODEL,
        }

        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.post(url, headers=headers, files=files, data=data)

                if response.status_code != 200:
                    try:
                        err_body = response.json()
                        detail_msg = err_body.get("detail", {})
                        if isinstance(detail_msg, dict) and detail_msg.get("code") == "invalid_api_key":
                            raise ValueError(
                                "ElevenLabs API Key Error: The key configured in backend/.env is an API Key ID. "
                                "ElevenLabs secret API keys start with 'sk_'."
                            )
                    except ValueError:
                        raise
                    except Exception:
                        pass

                    err_msg = response.text.replace(settings.ELEVENLABS_API_KEY, "[REDACTED]") if settings.ELEVENLABS_API_KEY else response.text
                    logger.warning("ElevenLabs STT error (HTTP %s): %s", response.status_code, err_msg)
                    raise RuntimeError(f"ElevenLabs STT failed with HTTP {response.status_code}: {err_msg}")

                data_res = response.json()
                return data_res.get("text", "").strip()

        except ValueError:
            raise
        except (httpx.TimeoutException, httpx.RequestError) as exc:
            logger.warning("ElevenLabs STT network error: %s", exc)
            raise RuntimeError("ElevenLabs STT request timed out or network failed.")


elevenlabs_service = ElevenLabsService()
