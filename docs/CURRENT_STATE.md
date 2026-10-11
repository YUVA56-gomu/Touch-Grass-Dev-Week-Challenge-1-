# 🌿 TOUCH GRASS — Current Application State

> **Last Updated**: October 11, 2026 · Critical Bug Fix: Complete Route & Header Isolation (`LandingLayout` vs `AppLayout`)

---

## 1. System Overview

TOUCH GRASS is fully verified and submission-ready. The application implements an architectural separation between the public landing page (`/`) and the application experience (`/friend`, `/tracker`, `/running`, `/calendar`):

1. **Root Landing Route (`/`)**:
   - Rendered using [`LandingLayout.tsx`](file:///d:/TouchGrass/src/components/layout/LandingLayout.tsx) and [`LandingHeader.tsx`](file:///d:/TouchGrass/src/components/layout/LandingHeader.tsx).
   - **Header Elements**: Touch Grass logo, Nature Companion branding, and navigation links: **Home** (`/`), **Features** (`#features`), **About** (`#how-it-works`), and **Meet Sprout** (`/friend`).
   - **Strict Isolation**: **Tracker**, **Running**, and **Calendar** navigation links are completely absent from the landing-page header.
   - **No Embedded App Modules**: Does not render `FriendChatPanel`, conversation UI, chat inputs, outdoor tracker, running GPS map, or calendar below the hero.
   - **Landing Content**: Hero with Sprout mascot illustration, headline (*"A little less scrolling. A little more living."*), reassurance badge, "Explore Features" button (scrolls to `#features`), "Meet Sprout" button (navigates to `/friend`), 4 feature cards, 3-step "How It Works" guide, closing banner, and dedicated landing footer.

2. **Sprout AI Companion Route (`/friend`)**:
   - Rendered using [`AppLayout.tsx`](file:///d:/TouchGrass/src/components/layout/AppLayout.tsx) and [`Navigation.tsx`](file:///d:/TouchGrass/src/components/layout/Navigation.tsx).
   - **Header Elements**: Brand logo, **Home** (`/`), **Sprout** (`/friend`), **Tracker** (`/tracker`), **Running** (`/running`), and **Calendar** (`/calendar`). Mobile bottom bar provides quick navigation across app sections.
   - **Chat Content**: Dedicated Sprout chat header, animated mascot sprite, full conversation UI, prompt chips (*"🌱 Why Touch Grass?"*, *"🌿 Tell me a forest story"*, *"🧘 I need a quick nature break"*), voice synthesis & Web Speech API fallback, microphone transcription, and guided nature break session modal.
   - **Strict Isolation**: Does not render the landing-page hero, landing sections, or landing header.

3. **Application Routes (`/tracker`, `/running`, `/calendar`)**:
   - Each route renders cleanly inside `AppLayout` with application navigation.
   - No landing-page hero or landing sections leak into any application route.

---

## 2. Root Cause Analysis & Architectural Fix

- **Previous Root Cause**: A shared layout wrapped all routes including `/`, and a single navigation component rendered app links (`Tracker`, `Running`, `Calendar`, plus mobile bottom bar) on the landing page.
- **Architectural Solution**:
  - Created [`LandingHeader.tsx`](file:///d:/TouchGrass/src/components/layout/LandingHeader.tsx) containing only Logo, Home, Features, About, and Meet Sprout.
  - Created [`LandingLayout.tsx`](file:///d:/TouchGrass/src/components/layout/LandingLayout.tsx) which pairs `LandingHeader` with `NatureBackground` for the `/` route.
  - Configured [`AppLayout.tsx`](file:///d:/TouchGrass/src/components/layout/AppLayout.tsx) with [`Navigation.tsx`](file:///d:/TouchGrass/src/components/layout/Navigation.tsx) specifically for the application routes (`/friend`, `/tracker`, `/running`, `/calendar`).
  - Separated the layout trees at the React Router 7 root level in [`src/app/router.tsx`](file:///d:/TouchGrass/src/app/router.tsx).

---

## 3. Active Components & Routing Matrix

| Route | Layout Component | Header Component | Body Component | Unwanted Elements Excluded |
|---|---|---|---|---|
| `/` | `LandingLayout` | `LandingHeader` | `LandingPage` | ❌ No Tracker/Running/Calendar links, no chat, no app components |
| `/friend` | `AppLayout` | `Navigation` | `FriendPage` | ❌ No landing hero, no landing feature cards, no landing header |
| `/tracker` | `AppLayout` | `Navigation` | `TrackerPage` | ❌ No landing hero, no landing sections |
| `/running` | `AppLayout` | `Navigation` | `RunningPage` | ❌ No landing hero, no landing sections |
| `/calendar` | `AppLayout` | `Navigation` | `CalendarPage` | ❌ No landing hero, no landing sections |

---

## 4. Empirical Verification Evidence

- **Backend Pytest Suite**: `python -m pytest backend/tests` &rarr; `22 passed in 0.45s`
- **Frontend TypeScript Check**: `npx tsc --noEmit` &rarr; `0 errors`
- **Frontend Vitest Suite**: `npx vitest run` &rarr; `12 passed test files (96 tests passed)`
- **Production Asset Build**: `npm run build` &rarr; `dist/` bundle created cleanly in `5.64s`
- **Manual Browser Verification**: Verified via recorded browser subagent session on `http://localhost:5173/`:
  - Verified `/` header displays only Logo, Home, Features, About, Meet Sprout. Tracker, Running, and Calendar are absent.
  - Verified `/` body renders only the landing page without chat or tracker/running components.
  - Verified `/friend` renders only Sprout chat with app navigation (Home, Sprout, Tracker, Running, Calendar).
  - Verified `/tracker`, `/running`, `/calendar` render with app navigation and no landing hero.
  - Verified clicking Home from any page returns cleanly to `/` with the landing-only header.
