# 🌿 TOUCH GRASS — Architecture Specification

> **System Architecture, Module Boundaries, Data Flow & Provider Interfaces**

---

## 1. High-Level System Architecture

TOUCH GRASS is designed as a **local-first web application** paired with an optional **FastAPI AI Gateway Backend** (`backend/`). The frontend operates independently in the browser and persists structured user data directly in IndexedDB (`touch_grass_db`), while delegating live LLM inference to the FastAPI backend proxy when available.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TOUCH GRASS Web Frontend                        │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  AI Friend   │  │   Tracker    │  │   Running    │  │  Calendar  │  │
│  │   Module     │  │   Module     │  │   Module     │  │   Module   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                │         │
│  ┌──────▼─────────────────▼─────────────────▼────────────────▼──────┐  │
│  │                     Provider Adapter Layer                       │  │
│  │  (FastAPILLMAdapter | StorageEngine | DefaultRouteProvider)      │  │
│  └──────┬─────────────────┬─────────────────┬────────────────┬──────┘  │
└─────────┼─────────────────┼─────────────────┼────────────────┼─────────┘
          │                 │                 │                │
┌─────────▼──────────┐  ┌───▼────────────┐  ┌─▼────────────┐  ┌▼──────────────┐
│ FastAPI Gateway    │  │ IndexedDB      │  │ Geolocation  │  │ Astronomy &   │
│ Backend Proxy      │  │ StorageEngine  │  │ & Maps API   │  │ Sky Events    │
│ (Python/FastAPI)   │  └────────────────┘  └──────────────┘  └───────────────┘
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│  Real LLM Provider │
│  (Google Gemini)   │
└────────────────────┘
```

---

## 2. Feature Module Implementation Details

### 2.1 Friend Module (`src/features/friend/`)
- **State Management**: React local state + explicit `GuidedSessionState` machine.
- **Persistence**: Friend name persisted in `localStorage` under `touch_grass_friend_name`.
- **Provider Interface**: Pluggable `AIProvider` interface supporting `FastAPILLMAdapter` and `MockAIProvider`.

### 2.2 Tracker Module (`src/features/tracker/`)
- **State Management**: Local React component state synced with `StorageEngine`.
- **Storage Layer**: Native IndexedDB (`touch_grass_db` v2) via [`StorageEngine.ts`](file:///d:/TouchGrass/src/services/storage/StorageEngine.ts) with memory fallback.
- **Streak & Statistics Engine**: Pure functions in [`streakUtils.ts`](file:///d:/TouchGrass/src/services/storage/streakUtils.ts) for local date formatting (`YYYY-MM-DD`), distinct outdoor days calculation, current & longest streak tracking, and spirit milestone badge unlocking.

---

## 3. Services Architecture (`src/services/`)

- **Storage Service** (`src/services/storage/`):
  - `StorageEngine.ts`: IndexedDB engine with CRUD operations for `visits`, `photos`, and `runs` stores.
  - `streakUtils.ts`: Pure deterministic calculations for streaks, distinct dates, and milestones.
- **AI Services** (`src/services/ai/`):
  - `MockAIProvider.ts`: Local development mock provider with simulated delay and cancellation support.
  - `FastAPILLMAdapter.ts`: HTTP backend gateway client for `/api/v1/ai/chat` with automatic offline fallback.
- **Voice Service** (`src/services/voice/VoiceService.ts`):
  - Abstraction for `SpeechRecognition` and `SpeechSynthesis`.
- **Audio Engine** (`src/services/audio/AudioEngine.ts`):
  - Web Audio API pink noise synthesis for Forest, Meadow, and Rain scenes.

---

## 4. FastAPI AI Gateway Backend (`backend/`)

- **`backend/app/main.py`**: FastAPI application entry point with CORS middleware and route setup.
- **`backend/app/core/config.py`**: Validated Pydantic settings loading from `backend/.env`.
- **`backend/app/schemas/chat.py`**: Typed `ChatRequest`, `ChatResponse`, `UserContext`, and `HealthResponse` models.
- **`backend/app/services/ai/`**:
  - `base.py`: Abstract `BaseLLMProvider` interface.
  - `gemini_provider.py`: Real LLM integration using Google Gemini API (`httpx.AsyncClient`) with timeout, error handling, and prompt validation.
  - `mock_provider.py`: Local backend fallback provider (`MockBackendProvider`).
  - `factory.py`: Config-driven provider instantiation.
