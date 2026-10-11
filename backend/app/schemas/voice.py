from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class TTSRequest(BaseModel):
    text: str = Field(..., description="Text content to synthesize into speech", min_length=1, max_length=500)
    voice: Optional[str] = Field(default="sprout", description="Selected approved voice profile ('sprout' or 'guardian')")

    @field_validator("text")
    def validate_text(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Text to speak cannot be empty or whitespace-only.")
        return s

    @field_validator("voice")
    def validate_voice(cls, v: Optional[str]) -> str:
        val = (v or "sprout").lower().strip()
        if val not in ["sprout", "guardian"]:
            raise ValueError(f"Invalid voice profile '{v}'. Allowed profiles: 'sprout', 'guardian'.")
        return val


class STTResponse(BaseModel):
    text: str = Field(..., description="Transcribed text from uploaded audio")


class VoiceProfile(BaseModel):
    id: str = Field(..., description="Voice profile identifier")
    name: str = Field(..., description="Display name of the voice profile")
    description: str = Field(..., description="Personality & tone description")


class VoiceListResponse(BaseModel):
    configured: bool = Field(..., description="Whether ElevenLabs API key is configured")
    voices: List[VoiceProfile] = Field(default_factory=list, description="Available approved voice profiles")
