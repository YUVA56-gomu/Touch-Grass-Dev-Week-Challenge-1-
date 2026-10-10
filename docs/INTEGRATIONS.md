# 🌿 TOUCH GRASS — External Service Integrations & Adapters

> **Provider Integration Specifications and External API Adapters**

---

## 1. Overview

TOUCH GRASS uses the **Adapter Pattern** to isolate all external service dependencies behind clean TypeScript interfaces (`src/services/`). This enables changing underlying vendors without modifying UI code.

---

## 2. External Integration Interfaces

### 2.1 AI Engine Adapters (`src/services/ai/`)
- **Primary Interface**: `AIProvider`
- **Supported Adapters**:
  - `WebSpeechAIAdapter`: Native browser speech synthesis & recognition (offline capability).
  - `FastAPILLMAdapter`: Backend proxy connection to external LLMs.

### 2.2 Map & Location Adapters (`src/services/location/`)
- **Primary Interface**: `LocationProvider`
- **Supported Adapters**:
  - `BrowserGeolocationAdapter`: Standard HTML5 Geolocation API.
  - `OpenStreetMapAdapter`: Leaflet / OSM tile visualizer with offline rural fallback.

### 2.3 Nature Event Data Adapters (`src/services/events/`)
- **Primary Interface**: `EventProvider`
- **Supported Adapters**:
  - `DeterministicAstronomyAdapter`: Pure JavaScript solar/lunar algorithms (sunrise, sunset, moon phases).
  - `LocalEventsAPIAdapter`: Fetches regional nature conservation and park event feeds.
