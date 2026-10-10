# 🌿 TOUCH GRASS — Your Nature Friend

> **Hacktoberfest 2026 Release · Local-First Web Application**
> *The virtual world is the invitation. The real world is the destination.*

TOUCH GRASS is an independent, local-first web application designed to help people slow down, step outside, and enjoy nature through a kind 16-bit AI friend, outdoor habit tracking, non-competitive running adventures, and a natural events calendar.

---

## 🌟 Key Application Sections

1. **Home — Your AI Friend (`/`)**: Landing centerpiece featuring your 16-bit mascot spirit (`Sprout`), interactive multi-turn chat, Web Audio ambient nature soundscapes (Forest, Meadow, Rain), speech controls, and 7-stage guided nature break sessions.
2. **Touch Grass Tracker (`/tracker`)**: Outdoor habit journal for logging nature visits, notes, mood reflections, photos (up to 5MB Blobs), streak counters, and 5 unlockable spirit milestone badges.
3. **Running Companion (`/running`)**: Non-competitive run distance picker (1k, 3k, 5k, custom, timed session), OpenStreetMap-attributed trail candidates, GPS position tracking, active session HUD, and offline/rural fallback.
4. **Nature Calendar (`/calendar`)**: Astronomical events (meteor showers, solstices, eclipses), solar daylight times (sunrise, sunset, golden hour), synodic moon phase calculations, seasonal nature blooms, wildlife migration periods, and verified UN environmental observances.

---

## 🚀 Quick Start & Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/YUVA56-gomu/Touch-Grass-Dev-Week-Challenge-1-.git
cd Touch-Grass-Dev-Week-Challenge-1-

# 2. Install dependencies
npm install

# 3. Start local Vite development server
npm run dev
```

The application will launch locally at `http://localhost:5173`.

---

## 🛠️ Verification & Quality Commands

```bash
# Run TypeScript static type check (0 errors)
npx tsc --noEmit

# Run unit & component test suite (58/58 tests passing across 8 files)
npx vitest run

# Build production bundle to /dist (built cleanly in ~7.5s)
npm run build
```

---

## 💡 Feature Status & Honest Capabilities Matrix

| Feature Section | Implementation Status | Data Source / Provider | Offline & Fallback Support |
|---|---|---|---|
| **AI Friend Chat** | **Implemented (Mock + Gateway)** | `MockAIProvider` (Default local spirit) / `FastAPILLMAdapter` (Optional backend proxy) | ✅ 100% offline ready via local `MockAIProvider` |
| **Ambient Audio** | **Implemented (Procedural)** | Web Audio API pink noise procedural synthesis (Forest lowpass, Meadow bandpass, Rain lowpass) | ✅ 100% offline synthesized in-browser |
| **Voice Speech API** | **Implemented (Browser Standard)** | Browser native `SpeechSynthesis` & `SpeechRecognition` APIs | ⚠️ Dependent on browser Web Speech API support |
| **Touch Grass Tracker** | **Implemented (Local-First)** | Browser IndexedDB (`touch_grass_db` v1) with in-memory fallback | ✅ 100% local-first storage on device |
| **Running GPS & HUD** | **Implemented (Browser GPS)** | HTML5 Geolocation API (`navigator.geolocation`) | ✅ Fallback to timed session & familiar-ground mode |
| **Route Candidates** | **Implemented (OSM Aligned)** | `DefaultRouteProvider` with OpenStreetMap trail alignment | ✅ Offline familiar-ground & timed session fallbacks |
| **Nature Calendar** | **Implemented (Calculated + Catalog)** | Deterministic solar/lunar algorithms & verified UN/IMO catalogs | ✅ 100% offline calculated & cataloged |

---

## 🎮 Short Demo Walkthrough (No Credentials Needed)

1. **Meet Your Spirit (`/`)**: Type *"Tell me a forest story"* into the chat box or click **"Start Guided Nature Session"** to experience a 3-segment ambient break with procedural nature audio.
2. **Log an Outdoor Visit (`/tracker`)**: Click **"+ Log Outdoor Visit"**, enter duration (e.g., 20 mins), location, notes, attach a photo, and save. Notice the outdoor streak and badges update immediately.
3. **Start a Run Adventure (`/running`)**: Select a target distance (e.g., 1k) or timed session, choose a route candidate, click **"Start Running Session"**, test pause/resume, and finish to save to run history.
4. **Explore the Sky & Nature (`/calendar`)**: Browse upcoming solar/lunar times, filter by Astronomy or Wildlife, and toggle event reminder preferences.

---

## 🔌 Optional FastAPI Backend Setup

If you wish to connect TOUCH GRASS to a real LLM server:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure `VITE_AI_BACKEND_URL`:
   ```env
   VITE_AI_BACKEND_URL=http://localhost:8000/api/v1
   ```
3. If the backend server is offline or unreachable, TOUCH GRASS silently and seamlessly falls back to the built-in local `MockAIProvider`.

---

## 🗺️ Data & Map Attributions

- **Map Data**: Trail routes and coordinates are attributed to **© OpenStreetMap contributors**.
- **Observances & Events**: Environmental observance dates sourced from **United Nations Environment Programme (UNEP)**, **EarthDay.org**, and **Arbor Day Foundation**.
- **Astronomy & Meteor Data**: Meteor shower peak dates sourced from **International Meteor Organization (IMO)**; Eclipses sourced from **NASA GSFC Eclipse Catalog**.

---

## 🔒 Privacy & Security

- **Zero Cloud Uploads**: Personal notes, photos, and GPS traces remain strictly on your local device inside browser IndexedDB.
- **No Unsolicited Tracking**: Location permissions are requested only when starting an active running session.
- **No Exposed Secrets**: No API keys are hardcoded in the client bundle.

---

## 📚 Documentation Index

- 📐 [**Architecture Specification**](docs/ARCHITECTURE.md)
- 🎯 [**Product Blueprint**](docs/PRODUCT_BLUEPRINT.md)
- 🎨 [**Design System**](docs/DESIGN_SYSTEM.md)
- 🔌 [**API Contracts**](docs/API_CONTRACTS.md)
- 💾 [**Data Model Schemas**](docs/DATA_MODEL.md)
- 🗺️ [**Development Roadmap**](docs/DEVELOPMENT_ROADMAP.md)
- 📜 [**ADR & Decision Log**](docs/DECISIONS.md)
- 📊 [**Current Application State**](docs/CURRENT_STATE.md)
- 🧪 [**Testing & Quality Strategy**](docs/TESTING.md)
- 🔒 [**Security & Privacy Architecture**](docs/SECURITY_PRIVACY.md)
- 🧩 [**Integrations & Adapters**](docs/INTEGRATIONS.md)
- 📋 [**Session Handoff & Continuity**](docs/SESSION_HANDOFF.md)
- 🛡️ [**Engineering Rules**](AGENTS.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
