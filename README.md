# 🌿 TOUCH GRASS — Your Nature Friend

> **Local-First Web Application & FastAPI AI Gateway Backend**
> *The virtual world is the invitation. The real world is the destination.*

TOUCH GRASS is an independent, local-first web application paired with a FastAPI AI Gateway backend (`backend/`) designed to help people slow down, step outside, and enjoy nature through a kind 16-bit AI friend, outdoor habit tracking, non-competitive running adventures with live pedestrian trail routing, and a natural events calendar.

---

## 🌟 Key Application Sections

1. **Dedicated Landing Page (`/`)**: 16-bit nature centerpiece introducing Sprout, "Meet Sprout" animated entrance experience, core value highlights, how-it-works guide, and nature footer.
2. **Sprout Companion Chat (`/friend`)**: Interactive multi-turn chat powered by **local Gemma 2 2B inference via Ollama** or Google Gemini API (with offline mock fallback), ElevenLabs voice synthesis & transcription (with native Web Speech API fallback), Web Audio ambient soundscapes (Forest, Meadow, Rain), and 7-stage guided nature break sessions.
3. **Touch Grass Tracker (`/tracker`)**: Outdoor habit journal for logging nature visits, notes, mood reflections, photos (up to 5MB Blobs), streak counters, and 5 unlockable spirit milestone badges stored local-first in IndexedDB.
4. **Running Companion (`/running`)**: Non-competitive run distance picker (1k, 3k, 5k, custom, timed session), live pedestrian trail route candidates fetched via Open Source Routing Machine (`OsrmRouteProvider`), real-time Leaflet OpenStreetMap trail mapping with dual-layer polyline (`LiveRunMap`), active session HUD with GPS precision filtering, and a dedicated post-run summary (`PostRunSummary`) with auto-fitted route bounds and Sprout encouragement.
5. **Nature Calendar (`/calendar`)**: Astronomical events (meteor showers, solstices, eclipses), solar daylight times (sunrise, sunset, golden hour), synodic moon phase calculations, seasonal nature blooms, wildlife migration periods, and verified UN environmental observances.

---

## 🦙 Local AI Inference via Ollama (Gemma 2 2B)

TOUCH GRASS supports **100% on-device private LLM inference** using Google Gemma 2 2B via Ollama. No private conversations or prompts are sent to external cloud APIs or persisted on the server.

### 1. Install & Pull Gemma 2 2B
```bash
# Verify Ollama is running
ollama serve

# Pull the lightweight, high-performance Gemma 2 2B model
ollama pull gemma2:2b
```

### 2. Configure Backend
In `backend/.env`:
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b
OLLAMA_TIMEOUT_SECONDS=30
```

---

## 🚀 Running the Application Locally

### 1. Start the FastAPI Backend
```bash
# In backend directory (or root with PYTHONPATH=backend)
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
*Health Check*: Visit `http://127.0.0.1:8000/api/v1/health` to confirm Ollama connectivity and Gemma 2B model readiness.

### 2. Start the Frontend Application
```bash
# In the project root directory
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment Architecture & Vercel Considerations

- **Frontend Deployment**: The frontend is built as a static client application suitable for deployment on **Vercel** or any static web host.
- **Local Demo Inference**: In a local development environment, the browser connects directly to `http://127.0.0.1:8000/api/v1` (configured via `VITE_AI_BACKEND_URL`), which in turn calls the local Ollama instance on `http://localhost:11434`.
- **Browser Security & Private Network Access (PNA)**:
  - A publicly hosted static web app (such as `https://touch-grass.vercel.app`) **cannot reach a user's private `localhost` or `127.0.0.1`** due to modern browser Private Network Access (PNA) security restrictions and Mixed Content policies (`https://` cannot make insecure requests to `http://localhost`).
  - To respect user security and privacy, TOUCH GRASS **never** disables browser security or exposes local endpoints to the public internet without encrypted tunnels.
  - For cloud-hosted frontend demos, Sprout gracefully provides the built-in offline mock companion with honest labeling (`Mock Nature Spirit (Offline Fallback)`), while local demos unlock real Gemma 2 2B inference.

---

## 🛠️ Verification & Quality Commands

```bash
# 1. Run Python backend pytest test suite (32 passed, including Ollama provider suite)
python -m pytest backend/tests

# 2. Run TypeScript static type check (0 errors)
npx tsc --noEmit

# 3. Run Vitest unit & component test suite (108/108 tests passing across 13 files)
npx vitest run

# 4. Build frontend production bundle to /dist
npm run build
```

---

## 🐳 Containerization & Deployment

The FastAPI backend is containerized for production deployment:

```bash
# Build backend container image
docker build -t touch-grass-backend:latest ./backend

# Run container locally
docker run -d --name touch_grass_backend -p 8000:8000 -e GEMINI_API_KEY=your_key touch-grass-backend:latest

# Or launch with Docker Compose
docker-compose up -d
```

---

## 🗺️ Data & Map Attributions

- **Pedestrian Routing & Map Data**: Trail routes and geometry fetched from **Open Source Routing Machine (OSRM)** and rendered with **Leaflet**, attributed to **© OpenStreetMap contributors**.
- **Observances & Events**: Environmental observance dates sourced from **United Nations Environment Programme (UNEP)**, **EarthDay.org**, and **Arbor Day Foundation**.
- **Astronomy & Meteor Data**: Meteor shower peak dates sourced from **International Meteor Organization (IMO)**; Eclipses sourced from **NASA GSFC Eclipse Catalog**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
