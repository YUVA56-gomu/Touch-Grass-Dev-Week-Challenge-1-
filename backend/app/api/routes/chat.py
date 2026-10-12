import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai.factory import get_llm_provider

logger = logging.getLogger("touch_grass.api.chat")
router = APIRouter()


@router.post("/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    POST /api/v1/ai/chat
    Processes incoming AI Friend prompt and returns structured response.
    """
    try:
        provider = get_llm_provider()
        response = await provider.generate_response(request)
        return response
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Unhandled error in chat endpoint: %s", exc, exc_info=False)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process your AI Friend conversation request. Please try again!",
        )
