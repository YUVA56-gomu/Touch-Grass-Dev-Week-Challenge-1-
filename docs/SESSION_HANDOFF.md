# 🌿 TOUCH GRASS — Session Handoff & Continuity Document

> **Last Audit & Lock-In**: October 11, 2026 · Critical Bug Fix: Complete Route & Header Isolation (`LandingLayout` vs `AppLayout`)

---

## 1. Project Purpose & Scope

**TOUCH GRASS** is an indie 16-bit nature companion web application paired with an optional FastAPI AI Gateway Backend (`backend/`) designed to help people reconnect with nature through a kind AI friend (Sprout), guided nature break sessions, outdoor habit tracking, non-competitive running adventures with live pedestrian trail routing, and a natural events calendar.

### Core Philosophy
*The virtual world is the invitation. The real world is the destination.*

---

## 2. Verified Completed Milestones

| Milestone | Status | Key Deliverables & Evidence |
|---|---|---|
| **Milestones 1–7** | ✅ **IMPLEMENTED AND VERIFIED** | React 19, Vite 6, TypeScript, React Router 7, 16-bit pixel art design system, local-first IndexedDB storage (`touch_grass_db` v2), GPS trail tracking, Web Audio pink noise synthesis, Nature Calendar astronomy engine, MIT License, and comprehensive documentation. |
| **Milestone 8.1–8.5** | ✅ **IMPLEMENTED AND VERIFIED** | FastAPI backend in `backend/`, Google Gemini LLM provider, OSRM pedestrian routing, ElevenLabs TTS & STT voice integration with browser Web Speech fallbacks, Leaflet live GPS runner with auto-follow, dedicated `PostRunSummary`, and passing test suites. |
| **Landing & App Layout Separation** | ✅ **IMPLEMENTED AND VERIFIED** | Layout trees split at router root: `LandingLayout` with `LandingHeader` on `/` (Home, Features, About, Meet Sprout; NO Tracker/Running/Calendar links, NO chat panel); `AppLayout` with `Navigation` on `/friend`, `/tracker`, `/running`, `/calendar` (Home, Sprout, Tracker, Running, Calendar; NO landing hero). 96 vitest tests and 22 pytest tests passing. |

---

## 3. Current Implementation State & Verification Evidence

- **Git Branch & Working Tree**: `main` branch.
- **Routing Configuration**:
  - `/` &rarr; `LandingLayout` &rarr; `LandingPage.tsx` (Public Landing Page with `LandingHeader`)
  - `/friend` &rarr; `AppLayout` &rarr; `FriendPage.tsx` (Sprout AI Chat with `Navigation`)
  - `/tracker` &rarr; `AppLayout` &rarr; `TrackerPage.tsx` (Outdoor Visit Journal with `Navigation`)
  - `/running` &rarr; `AppLayout` &rarr; `RunningPage.tsx` (GPS Running Companion with `Navigation`)
  - `/calendar` &rarr; `AppLayout` &rarr; `CalendarPage.tsx` (Nature Calendar with `Navigation`)
- **Empirical Test & Build Evidence**:
  - Backend Pytest Suite: `python -m pytest backend/tests` &rarr; `22 passed in 0.45s`
  - Frontend Type Check: `npx tsc --noEmit` &rarr; `0 errors`
  - Frontend Vitest Suite: `npx vitest run` &rarr; `12 test files passed (96 tests passed)`
  - Production Asset Build: `npm run build` &rarr; `dist/` production bundle generated cleanly in `5.64s`.
  - Manual Browser Inspection: Verified in real browser session via subagent. Confirmed landing header contains only Home, Features, About, Meet Sprout, and no Tracker, Running, Calendar links. Confirmed all app pages render cleanly.

---

## 4. How to Run Frontend & Backend

### 1. Start FastAPI Backend Locally
```bash
set PYTHONPATH=.
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start React Frontend Server
```bash
npm run dev
```

### 3. Run Quality Verification Gates
```bash
npx tsc --noEmit
npx vitest run
npm run build
python -m pytest backend/tests
```
