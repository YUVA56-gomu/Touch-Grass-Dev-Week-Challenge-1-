import logging
import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Response, status

from app.core.config import settings
from app.schemas.voice import TTSRequest, STTResponse, VoiceListResponse
from app.services.voice.elevenlabs_service import elevenlabs_service

logger = logging.getLogger("touch_grass.api.voice")
router = APIRouter()

ALLOWED_AUDIO_MIME_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
    "audio/aac",
}

ALLOWED_AUDIO_EXTENSIONS = {".webm", ".wav", ".mp3", ".ogg", ".m4a", ".aac"}


@router.get("/voice/voices", response_model=VoiceListResponse)
async def get_voices():
    """Returns available server-configured approved voice profiles."""
    profiles = elevenlabs_service.get_voice_profiles()
    return VoiceListResponse(
        configured=elevenlabs_service.is_configured(),
        voices=profiles,
    )


@router.post("/voice/speech")
async def generate_speech(request: TTSRequest):
    """
    POST /api/v1/voice/speech
    Generates ElevenLabs MP3 audio bytes for specified text prompt.
    """
    if not elevenlabs_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ElevenLabs API key is not configured on the backend server.",
        )

    try:
        audio_bytes = await elevenlabs_service.generate_speech(request.text, request.voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except RuntimeError as run_err:
        logger.error("Error generating ElevenLabs speech: %s", run_err)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(run_err))
    except Exception as exc:
        logger.error("Error generating ElevenLabs speech: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to generate ElevenLabs speech: {str(exc)}",
        )


@router.post("/voice/transcribe", response_model=STTResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """
    POST /api/v1/voice/transcribe
    Transcribes uploaded user audio recording into text via ElevenLabs Speech-to-Text API.
    """
    if not elevenlabs_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ElevenLabs API key is not configured on the backend server.",
        )

    if not file or not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No audio file uploaded.")

    # Validate file extension & content type
    ext = os.path.splitext(file.filename)[1].lower()
    content_type = (file.content_type or "").lower()

    if ext not in ALLOWED_AUDIO_EXTENSIONS and content_type not in ALLOWED_AUDIO_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported audio format '{content_type}'. Please upload WebM, WAV, MP3, OGG, or M4A audio.",
        )

    audio_bytes = await file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded audio file is empty.")

    if len(audio_bytes) > settings.ELEVENLABS_MAX_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file size exceeds 10MB limit ({(len(audio_bytes)/1024/1024):.1f}MB).",
        )

    try:
        transcript = await elevenlabs_service.transcribe_audio(
            audio_bytes=audio_bytes,
            filename=file.filename,
            content_type=content_type or "audio/webm",
        )
        return STTResponse(text=transcript)
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as exc:
        logger.error("Error transcribing ElevenLabs audio: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Speech transcription failed. Please try again or type your message!",
        )
