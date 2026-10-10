# 🌿 TOUCH GRASS — Architecture Specification

> **System Architecture, Module Boundaries, Data Flow & Provider Interfaces**

---

## 1. High-Level System Architecture

TOUCH GRASS is designed as a **local-first web application** built with React, Vite, TypeScript, and CSS variables. The frontend operates independently in the browser and persists structured user data directly in IndexedDB (`touch_grass_db`).

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
│ (WebSpeech/LLM)│  │ StorageEngine  │  │ & Maps API   │  │ Sky Events   │
└────────────────┘  └────────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Feature Module Implementation Details

### 2.1 Friend Module (`src/features/friend/`)
- **State Management**: React local state + explicit `GuidedSessionState` machine.
- **Persistence**: Friend name persisted in `localStorage` under `touch_grass_friend_name`.

### 2.2 Tracker Module (`src/features/tracker/`)
- **State Management**: Local React component state synced with `StorageEngine`.
- **Storage Layer**: Native IndexedDB (`touch_grass_db` v1) via [`StorageEngine.ts`](file:///d:/TouchGrass/src/services/storage/StorageEngine.ts) with memory fallback.
- **Streak & Statistics Engine**: Pure functions in [`streakUtils.ts`](file:///d:/TouchGrass/src/services/storage/streakUtils.ts) for local date formatting (`YYYY-MM-DD`), distinct outdoor days calculation, current & longest streak tracking, and spirit milestone badge unlocking.

---

## 3. Services Architecture (`src/services/`)

- **Storage Service** (`src/services/storage/`):
  - `StorageEngine.ts`: IndexedDB engine with CRUD operations for `visits` and `photos` object stores.
  - `streakUtils.ts`: Pure deterministic calculations for streaks, distinct dates, and milestones.
  - `types.ts`: Strongly typed interfaces (`OutdoorVisit`, `PhotoBlob`, `ActivitySummary`, `IStorageEngine`).
- **AI Services** (`src/services/ai/`):
  - `MockAIProvider.ts`: Offline dev provider with simulated delay, cancellation token support, and error injection.
  - `FastAPILLMAdapter.ts`: HTTP backend gateway client for `/api/v1/ai/chat`.
- **Voice Service** (`src/services/voice/VoiceService.ts`):
  - Abstraction for `SpeechRecognition` and `SpeechSynthesis`.
- **Audio Engine** (`src/services/audio/AudioEngine.ts`):
  - Web Audio API pink noise synthesis for Forest, Meadow, and Rain scenes.
