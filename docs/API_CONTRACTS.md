# 🌿 TOUCH GRASS — API Contracts & Adapter Specifications

> **Frontend/Backend & External Service Interface Contracts**

---

## 1. Overview

TOUCH GRASS operates as a local-first frontend application. Backend services (FastAPI API gateway) and external provider integrations follow strict JSON payload contracts.

---

## 2. AI Companion Endpoint Contract

### POST `/api/v1/ai/chat`
Sends a prompt to the AI Friend and receives a structured response with speech narration text and spirit mood.

**Request Payload**:
```json
{
  "session_id": "usr-local-84920",
  "message": "I'm feeling stressed after a long day indoors.",
  "user_context": {
    "local_time": "17:30",
    "weather": "sunny",
    "recent_visits_count": 3
  }
}
```

**Response Payload**:
```json
{
  "reply_text": "I hear you, friend! The afternoon sun is just starting to soften. How about taking a quick 5-minute breather near a window or stepping into the yard?",
  "expression": "happy",
  "suggested_action": "explore_nature",
  "audio_narration_url": null
}
```

---

## 3. Nature Calendar Provider Contract

### GET `/api/v1/calendar/events`
Fetches upcoming astronomical, seasonal, and outdoor phenomena based on lat/lng coordinates and time window.

**Query Parameters**:
- `lat` (float): Latitude (e.g. `37.7749`)
- `lng` (float): Longitude (e.g. `-122.4194`)
- `days` (int): Number of forecast days (e.g. `7`)

**Response Payload**:
```json
{
  "location": { "lat": 37.7749, "lng": -122.4194 },
  "events": [
    {
      "id": "evt-lunar-full-2026-10",
      "title": "Hunter's Full Moon",
      "category": "astronomy",
      "date": "2026-10-15T20:00:00Z",
      "status": "calculated",
      "description": "Bright autumn full moon visible across clear night skies.",
      "visibility_quality": "excellent"
    }
  ]
}
```

---

## 4. Map & Route Provider Contract

### GET `/api/v1/running/routes`
Fetches nature trail route candidates for outdoor running distance selection.

**Query Parameters**:
- `lat` (float)
- `lng` (float)
- `distance_km` (float, e.g. `3.0`)

**Response Payload**:
```json
{
  "requested_distance_km": 3.0,
  "routes": [
    {
      "route_id": "trail-forest-loop-1",
      "name": "Pine Needles Forest Loop",
      "distance_km": 3.2,
      "surface_type": "dirt_path",
      "nature_rating": "high",
      "waypoints": [
        { "lat": 37.7749, "lng": -122.4194 },
        { "lat": 37.7780, "lng": -122.4220 }
      ]
    }
  ]
}
```
