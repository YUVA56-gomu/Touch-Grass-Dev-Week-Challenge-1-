import os
from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "TOUCH GRASS AI Gateway"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # CORS
    CORS_ORIGINS: Any = "http://localhost:5173,http://127.0.0.1:5173"

    # LLM Provider Settings ("gemini" | "ollama" | "openai" | "mock")
    LLM_PROVIDER: str = "ollama"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Ollama Local Gemma Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma2:2b"
    OLLAMA_TIMEOUT_SECONDS: float = 30.0

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # ElevenLabs Voice Provider Settings
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"          # Sprout voice ID (Rachel)
    ELEVENLABS_GUARDIAN_VOICE_ID: str = "AZnzlk1XvdvUeBnXmlld" # Forest Guardian voice ID (Domi)
    ELEVENLABS_TTS_MODEL: str = "eleven_multilingual_v2"
    ELEVENLABS_STT_MODEL: str = "scribe_v1"
    ELEVENLABS_MAX_TEXT_LENGTH: int = 500
    ELEVENLABS_MAX_AUDIO_SIZE_BYTES: int = 10 * 1024 * 1024

    # Request Limits & Timeouts
    REQUEST_TIMEOUT_SECONDS: float = 10.0
    MAX_PROMPT_LENGTH: int = 1000

    @field_validator("ELEVENLABS_API_KEY", mode="before")
    def parse_elevenlabs_key(cls, v: Any) -> str:
        if v and str(v).strip():
            return str(v).strip()
        env_alt = os.environ.get("ELEVEN_LAB", "")
        if env_alt and env_alt.strip():
            return env_alt.strip()
        return ""

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    import json
                    return json.loads(v_str)
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        if isinstance(v, list):
            return v
        return ["http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()
