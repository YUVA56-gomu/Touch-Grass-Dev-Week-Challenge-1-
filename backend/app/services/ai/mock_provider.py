import random
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai.base import BaseLLMProvider


class MockBackendProvider(BaseLLMProvider):
    """Local fallback AI provider that generates warm, 16-bit nature spirit responses."""

    provider_name = "Mock Nature Spirit"
    is_mock = True

    MOCK_RESPONSES = [
        ("I hear you, friend! The afternoon breeze is whispering through the trees. Take a gentle breath and let your shoulders drop.", "happy"),
        ("Sometimes the best thing we can do is step away from our screens for five quiet minutes. The grass and sky are waiting for you!", "waving"),
        ("The forest trees grow slowly and patiently. There is no rush right now. Breathe in clean air... and relax.", "thinking"),
        ("Every moment outdoors refreshes our spirit! Even stepping onto a porch or opening a window brings nature's touch to you.", "celebrating"),
        ("Nature is always here to welcome you back. Take three deep, slow breaths and enjoy this present moment.", "resting"),
    ]

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        friend_name = (request.user_context.friend_name if request.user_context else "Sprout") or "Sprout"
        prompt_lower = request.message.lower()

        reply_text = None
        expression = "happy"

        if "story" in prompt_lower or "forest" in prompt_lower:
            reply_text = (
                f"Once upon a time in an ancient emerald canopy, the old pine trees shared stories with the morning breeze. "
                f"I'm {friend_name}, and I love remembering how soft the moss feels underfoot."
            )
            expression = "waving"
        elif "relax" in prompt_lower or "stress" in prompt_lower or "tired" in prompt_lower:
            reply_text = (
                f"Take a deep breath with me, friend. Inhale peace... exhale tension. "
                f"Imagine stepping onto soft grass under a warm, gentle sun."
            )
            expression = "resting"
        elif "why" in prompt_lower or "touch grass" in prompt_lower:
            reply_text = (
                f"Touching grass connects us to the earth! It slows down our racing thoughts, lowers stress, "
                f"and reminds us that we are part of this beautiful, living world."
            )
            expression = "celebrating"
        else:
            selected_text, selected_expr = random.choice(self.MOCK_RESPONSES)
            reply_text = selected_text
            expression = selected_expr

        return ChatResponse(
            reply_text=reply_text,
            expression=expression,
            suggested_prompts=[
                "Tell me a forest story",
                "How can I relax right now?",
                "Why is touching grass good for me?",
            ],
            audio_narration_url=None,
            is_mock=True,
        )

    def is_configured(self) -> bool:
        return True
