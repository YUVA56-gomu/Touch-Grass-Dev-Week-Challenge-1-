# 🌿 TOUCH GRASS — Your Nature Friend

> **Local-First Web Application & FastAPI AI Gateway Backend**
> *The virtual world is the invitation. The real world is the destination.*

TOUCH GRASS is an independent, local-first web application paired with a FastAPI AI Gateway backend (`backend/`) designed to help people slow down, step outside, and enjoy nature through a kind 16-bit AI friend, outdoor habit tracking, non-competitive running adventures with live pedestrian trail routing, and a natural events calendar.

---

## 🌟 Key Application Sections

1. **Home — Your AI Friend (`/`)**: Landing centerpiece featuring your 16-bit mascot spirit (`Sprout`), interactive multi-turn chat powered by FastAPI & Google Gemini API (with offline mock fallback), ElevenLabs voice synthesis & transcription (with native Web Speech API fallback), Web Audio ambient nature soundscapes (Forest, Meadow, Rain), and 7-stage guided nature break sessions.
2. **Touch Grass Tracker (`/tracker`)**: Outdoor habit journal for logging nature visits, notes, mood reflections, photos (up to 5MB Blobs), streak counters, and 5 unlockable spirit milestone badges stored local-first in IndexedDB.
3. **Running Companion (`/running`)**: Non-competitive run distance picker (1k, 3k, 5k, custom, timed session), live pedestrian trail route candidates fetched via Open Source Routing Machine (`OsrmRouteProvider`), real-time Leaflet OpenStreetMap trail mapping with dual-layer polyline (`LiveRunMap`), active session HUD with GPS precision filtering, and a dedicated post-run summary (`PostRunSummary`) with auto-fitted route bounds and Sprout encouragement.
4. **Nature Calendar (`/calendar`)**: Astronomical events (meteor showers, solstices, eclipses), solar daylight times (sunrise, sunset, golden hour), synodic moon phase calculations, seasonal nature blooms, wildlife migration periods, and verified UN environmental observances.

---

## 🚀 Running the Application Locally

### 1. Start the FastAPI Backend
```bash
# Navigate to backend directory and start Uvicorn server
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
*Note: If no API keys are provided in `backend/.env`, the backend transparently serves mock AI responses and reports voice configuration status.*

### 2. Start the Frontend Application
```bash
# In the project root directory
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Verification & Quality Commands

```bash
# 1. Run Python backend pytest test suite (22 passed)
python -m pytest backend/tests

# 2. Run TypeScript static type check (0 errors)
npx tsc --noEmit

# 3. Run Vitest unit & component test suite (88/88 tests passing across 11 files)
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
