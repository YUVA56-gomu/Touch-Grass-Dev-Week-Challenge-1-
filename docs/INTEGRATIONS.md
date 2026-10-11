# 🌿 TOUCH GRASS — External Service Integrations & Adapters

> **Provider Integration Specifications and External API Adapters**

---

## 1. Overview

TOUCH GRASS uses the **Adapter Pattern** to isolate all external service dependencies behind clean TypeScript interfaces (`src/services/`) and Python backend services (`backend/app/services/`). This enables changing underlying vendors without modifying UI code.

---

## 2. External Integration Interfaces

### 2.1 AI Engine Adapters (`src/services/ai/` & `backend/app/services/ai/`)
- **Primary Interface**: `AIProvider` (Frontend) / `BaseLLMProvider` (Backend)
- **Supported Adapters**:
  - `FastAPILLMAdapter`: Frontend HTTP client for `/api/v1/ai/chat` with automatic offline fallback.
  - `GeminiProvider`: Real LLM backend integration calling Google Gemini API (`gemini-2.5-flash`) via `httpx.AsyncClient`.
  - `MockAIProvider` / `MockBackendProvider`: Local fallback nature spirit providers.

### 2.2 Map & Pedestrian Routing Adapters (`src/services/running/`)
- **Primary Interface**: `IRouteProvider`
- **Supported Adapters**:
  - `OsrmRouteProvider`: Live pedestrian trail routing using Open Source Routing Machine (`https://router.project-osrm.org/route/v1/foot`).
  - `DefaultRouteProvider`: Main route discovery provider wrapping OSRM with local familiar-ground and timed-session fallbacks.
  - **Attribution**: `Routing by OSRM · Map data © OpenStreetMap contributors`.

### 2.3 Nature Event Data Adapters (`src/services/calendar/`)
- **Primary Interface**: `ICalendarEventProvider`
- **Supported Adapters**:
  - `astronomyEngine.ts`: Pure JavaScript solar/lunar algorithms (sunrise, sunset, 8 synodic moon phases, solstices, equinoxes).
  - `SeasonalNatureProvider.ts`: Verified UN environmental observances (UNEP, EarthDay.org, Arbor Day) and seasonal bloom phenology.
  - `CompositeCalendarProvider.ts`: Combines astronomical and seasonal event providers with category filtering.
