from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class ChatMessage(BaseModel):
    role: str = Field(..., description="Sender role: 'user' or 'assistant'")
    text: str = Field(..., description="Message text content")

    @field_validator("text")
    def validate_text(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Message text cannot be empty.")
        return s


class UserContext(BaseModel):
    friend_name: Optional[str] = Field(default="Sprout", description="User's custom spirit name")
    time_of_day: Optional[str] = Field(default=None, description="Current time of day string")
    recent_visits_count: Optional[int] = Field(default=None, description="Number of recent outdoor visits")


class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(default="local_session", description="Local session identifier")
    message: str = Field(..., description="User prompt text", min_length=1, max_length=1000)
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation turns")
    user_context: Optional[UserContext] = Field(default_factory=UserContext, description="User contextual preferences")

    @field_validator("message")
    def validate_message(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Message prompt cannot be empty or whitespace-only.")
        return s


class ChatResponse(BaseModel):
    reply_text: str = Field(..., description="AI Friend response text")
    expression: str = Field(default="happy", description="Mascot spirit expression key")
    suggested_prompts: List[str] = Field(
        default_factory=lambda: [
            "Tell me a forest story",
            "How can I relax right now?",
            "Why is touching grass good for me?",
        ],
        description="Suggested quick prompt chips",
    )
    audio_narration_url: Optional[str] = Field(default=None, description="Optional narration audio URL")
    is_mock: bool = Field(default=False, description="Flag indicating if response came from local fallback")
    provider_name: Optional[str] = Field(default=None, description="Active LLM provider name")


class HealthResponse(BaseModel):
    status: str = Field(default="ok")
    service: str = Field(default="TOUCH GRASS AI Gateway")
    version: str = Field(default="1.0.0")
    llm_provider: str = Field(..., description="Configured LLM provider name")
    llm_configured: bool = Field(..., description="Whether LLM API key is configured")
    llm_status_note: str = Field(default="Using local mock provider fallback.", description="Honest status note regarding live vs mock inference state")
