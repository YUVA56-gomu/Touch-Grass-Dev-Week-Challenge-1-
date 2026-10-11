# 🌿 TOUCH GRASS — Your Nature Friend

> **Local-First Web Application & FastAPI AI Gateway Backend**
> *The virtual world is the invitation. The real world is the destination.*

TOUCH GRASS is an independent, local-first web application paired with a FastAPI AI Gateway backend (`backend/`) designed to help people slow down, step outside, and enjoy nature through a kind 16-bit AI friend, outdoor habit tracking, non-competitive running adventures with live pedestrian trail routing, and a natural events calendar.

---

## 🌟 Key Application Sections

1. **Home — Your AI Friend (`/`)**: Landing centerpiece featuring your 16-bit mascot spirit (`Sprout`), interactive multi-turn chat powered by FastAPI & Google Gemini API, Web Audio ambient nature soundscapes (Forest, Meadow, Rain), speech controls, and 7-stage guided nature break sessions.
2. **Touch Grass Tracker (`/tracker`)**: Outdoor habit journal for logging nature visits, notes, mood reflections, photos (up to 5MB Blobs), streak counters, and 5 unlockable spirit milestone badges.
3. **Running Companion (`/running`)**: Non-competitive run distance picker (1k, 3k, 5k, custom, timed session), live pedestrian trail route candidates fetched via Open Source Routing Machine (`OsrmRouteProvider`), GPS position tracking, active session HUD, and offline/rural fallback.
4. **Nature Calendar (`/calendar`)**: Astronomical events (meteor showers, solstices, eclipses), solar daylight times (sunrise, sunset, golden hour), synodic moon phase calculations, seasonal nature blooms, wildlife migration periods, and verified UN environmental observances.

---

## 🛠️ Verification & Quality Commands

```bash
# 1. Run Python backend pytest test suite (12 passed in 0.32s)
python -m pytest backend/tests

# 2. Run TypeScript static type check (0 errors)
npx tsc --noEmit

# 3. Run Vitest unit & component test suite (61/61 tests passing across 8 files)
npx vitest run

# 4. Build frontend production bundle to /dist (built cleanly in ~4.6s)
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

- **Pedestrian Routing & Map Data**: Trail routes and geometry fetched from **Open Source Routing Machine (OSRM)** and attributed to **© OpenStreetMap contributors**.
- **Observances & Events**: Environmental observance dates sourced from **United Nations Environment Programme (UNEP)**, **EarthDay.org**, and **Arbor Day Foundation**.
- **Astronomy & Meteor Data**: Meteor shower peak dates sourced from **International Meteor Organization (IMO)**; Eclipses sourced from **NASA GSFC Eclipse Catalog**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
