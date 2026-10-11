# 🌿 TOUCH GRASS — API Contracts & Adapter Specifications

> **Frontend/Backend & External Service Interface Contracts**

---

## 1. Overview

TOUCH GRASS operates as a local-first frontend application paired with a FastAPI API gateway backend (`backend/`). The API follows strict JSON request/response schema contracts.

---

## 2. Health Endpoint Contract

### GET `/api/v1/health`
Checks backend status and configured LLM provider state.

**Response Payload**:
```json
{
  "status": "ok",
  "service": "TOUCH GRASS AI Gateway",
  "version": "1.0.0",
  "llm_provider": "Google Gemini LLM",
  "llm_configured": true
}
```

---

## 3. AI Companion Endpoint Contract

### POST `/api/v1/ai/chat`
Sends a prompt to the AI Friend and receives a structured response with speech narration text, spirit mood expression, and suggested prompts.

**Request Payload**:
```json
{
  "session_id": "local_session",
  "message": "I'm feeling stressed after a long day indoors.",
  "history": [
    { "role": "user", "text": "Hello Sprout!" },
    { "role": "assistant", "text": "Hello friend! Welcome to the forest." }
  ],
  "user_context": {
    "friend_name": "Sprout",
    "time_of_day": "afternoon"
  }
}
```

**Response Payload**:
```json
{
  "reply_text": "I hear you, friend! The afternoon sun is just starting to soften. How about taking a quick 5-minute breather near a window or stepping into the yard?",
  "expression": "resting",
  "suggested_prompts": [
    "Tell me a forest story",
    "How can I relax right now?",
    "Why is touching grass good for me?"
  ],
  "audio_narration_url": null,
  "is_mock": false
}
```

---

## 4. Nature Calendar Provider Contract

### GET `/api/v1/calendar/events`
Fetches upcoming astronomical, seasonal, and outdoor phenomena based on lat/lng coordinates and time window.

**Query Parameters**:
- `lat` (float): Latitude (e.g. `37.7749`)
- `lng` (float): Longitude (e.g. `-122.4194`)
- `days` (int): Number of forecast days (e.g. `7`)

---

## 5. Map & Route Provider Contract

### GET `/api/v1/running/routes`
Fetches nature trail route candidates for outdoor running distance selection.

**Query Parameters**:
- `lat` (float)
- `lng` (float)
- `distance_km` (float, e.g. `3.0`)
