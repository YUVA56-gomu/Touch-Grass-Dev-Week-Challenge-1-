# 🌿 TOUCH GRASS — Architecture Specification

> **System Architecture, Module Boundaries, Data Flow & Provider Interfaces**

---

## 1. High-Level System Architecture

TOUCH GRASS is designed as a **local-first web application** built with React, Vite, TypeScript, and CSS variables. The frontend operates independently in the browser and connects to external AI models or map APIs through clean provider adapter interfaces. When server-side processing or key security is required, a lightweight FastAPI microservice acts as an API gateway.

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
│  │  (AI Provider | Storage Provider | Maps Provider | Events)       │  │
│  └──────┬─────────────────┬─────────────────┬────────────────┬──────┘  │
└─────────┼─────────────────┼─────────────────┼────────────────┼─────────┘
          │                 │                 │                │
┌─────────▼──────┐  ┌───────▼────────┐  ┌─────▼────────┐  ┌───▼──────────┐
│  AI Engine     │  │ IndexedDB      │  │ Geolocation  │  │ Astronomy &  │
│ (WebSpeech/LLM)│  │ (Local Storage)│  │ & Maps API   │  │ Sky Events   │
└────────────────┘  └────────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Feature Module Implementation Details

### Friend Module (`src/features/friend/`)
- **State Management**: React local state + explicit `GuidedSessionState` machine (`idle` | `preparing` | `playing` | `paused` | `completed` | `cancelled` | `error`).
- **Persistence**: Friend name persisted in `localStorage` under `touch_grass_friend_name`.
- **Character Expression Binding**: Mascot expressions (`happy`, `waving`, `excited`, `thinking`, `resting`) bound directly to conversation and playback state.

---

## 3. Services Architecture (`src/services/`)

- **AI Services** (`src/services/ai/`):
  - `MockAIProvider.ts`: Offline dev provider with simulated delay, cancellation token support, and error injection.
  - `FastAPILLMAdapter.ts`: HTTP backend gateway client for `/api/v1/ai/chat`.
- **Voice Service** (`src/services/voice/VoiceService.ts`):
  - Abstraction for `SpeechRecognition` and `SpeechSynthesis`.
- **Audio Engine** (`src/services/audio/AudioEngine.ts`):
  - Web Audio API pink noise synthesis for Forest, Meadow, and Rain scenes.
