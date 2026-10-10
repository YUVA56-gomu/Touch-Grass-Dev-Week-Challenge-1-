# 🌿 TOUCH GRASS — Architectural Decision Records (ADR) & Unknowns Log

> **Established Decisions, Proposed Directions & Unresolved Product Choices**

---

## 1. Established Technology Decisions (Accepted)

### ADR 001: Stand-alone Web Application Architecture
- **Status**: **ACCEPTED** (October 10, 2026)
- **Context**: TOUCH GRASS requires a clean, maintainable architecture for the Hacktoberfest Dev Week Challenge.
- **Decision**: Build TOUCH GRASS as an independent React 19 + TypeScript + Vite SPA.
- **Consequences**: Fast local builds, zero legacy overhead, modular feature structure.

### ADR 002: Modular CSS Design Tokens & Pixel Art System
- **Status**: **ACCEPTED** (October 10, 2026)
- **Context**: Need a distinctive 16-bit cozy visual identity that avoids generic corporate dashboard aesthetics.
- **Decision**: Use CSS variables (`variables.css`), Google Fonts (`VT323` and `Outfit`), and `image-rendering: pixelated;` instead of heavy utility CSS libraries.
- **Consequences**: Lightweight bundle size (`14.5 kB` CSS), complete visual control, accessibility compliance.

### ADR 003: Local-First IndexedDB Storage Model
- **Status**: **ACCEPTED** (October 10, 2026)
- **Context**: User visit logs, memory photos, and running coordinates contain private location data.
- **Decision**: Store all personal data in browser IndexedDB. No mandatory account login or external database storage.
- **Consequences**: High privacy, offline capability, zero server hosting costs for user data.

---

## 2. Proposed Architecture Directions (Under Evaluation)

### ADR 004 (Proposed): FastAPI Gateway for Server AI & Map Tiles
- **Status**: **PROPOSED**
- **Context**: Browsers cannot safely expose private API keys for LLM providers or map tile vendors.
- **Proposed Solution**: Lightweight Python FastAPI backend microservice to proxy LLM calls and tile requests securely.

---

## 3. Explicit Unresolved Choices & Unknowns

The following architectural choices are explicitly **UNRESOLVED**. Developers MUST NOT invent answers or implement mock placeholders for these until decided:

1. **AI Provider & Voice Model**:
   - *Question*: Will voice conversation use native browser Web Speech API (free/offline) or an external LLM voice API (e.g. OpenAI Realtime / ElevenLabs)?
   - *Status*: Pending evaluation in Milestone 3.

2. **Authentication Requirements**:
   - *Question*: Is optional user login required, or will TOUCH GRASS remain 100% anonymous & local-first?
   - *Status*: Currently local-first. Authentication deferred unless cloud backup is requested.

3. **Map & Routing Provider**:
   - *Question*: Will trail routes use Mapbox, OpenStreetMap/Leaflet, or Google Maps API?
   - *Status*: Pending evaluation in Milestone 5.

4. **Nature-Event Data Sources**:
   - *Question*: Which external API will provide real-time meteor shower and sky event data (e.g. US Naval Observatory, NASA API, or local astronomy algorithms)?
   - *Status*: Pending evaluation in Milestone 6.

5. **Photo Storage & Backup Strategy**:
   - *Question*: Should visit memory photos be stored directly as compressed Blobs in IndexedDB, or exported as a zip file?
   - *Status*: Pending evaluation in Milestone 4.

6. **Scheduled Outdoor Notifications**:
   - *Question*: Will outdoor reminders use browser Web Notifications API or Service Worker push triggers?
   - *Status*: Pending evaluation in Milestone 4/5.

7. **Future Native Mobile Packaging**:
   - *Question*: Will TOUCH GRASS be wrapped as a Progressive Web App (PWA) or packaged using Capacitor for mobile stores?
   - *Status*: Deferred for post-hackathon releases.
