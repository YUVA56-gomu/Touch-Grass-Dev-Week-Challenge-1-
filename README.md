# 🌿 TOUCH GRASS — Your Nature Friend

> **Hacktoberfest Project · Complete Product Architecture & Documentation Lock-in (Milestone 2)**

TOUCH GRASS helps people reconnect with nature through a kind AI friend, immersive outdoor activity tracking, running adventures, and a nature calendar.

---

## 📚 Documentation Index

All architectural specifications, API contracts, data models, and design system rules are documented in the [`docs/`](file:///d:/TouchGrass/docs) folder:

- 📐 [**Architecture Specification**](file:///d:/TouchGrass/docs/ARCHITECTURE.md) — High-level architecture, module boundaries, & provider adapter rules.
- 🎯 [**Product Blueprint & Truth**](file:///d:/TouchGrass/docs/PRODUCT_BLUEPRINT.md) — The four application sections, scope boundaries, & release schedule.
- 🎨 [**Design System**](file:///d:/TouchGrass/docs/DESIGN_SYSTEM.md) — 16-bit nature palette tokens, typography, & crisp pixel art rendering rules.
- 🔌 [**API Contracts**](file:///d:/TouchGrass/docs/API_CONTRACTS.md) — Interface payloads for AI endpoints, maps, & calendar feeds.
- 💾 [**Data Model Schemas**](file:///d:/TouchGrass/docs/DATA_MODEL.md) — Schemas for local-first IndexedDB storage (`UserProfile`, `OutdoorVisit`, `RunSession`, `AIMemory`, `NatureCalendarEvent`).
- 🗺️ [**Development Roadmap**](file:///d:/TouchGrass/docs/DEVELOPMENT_ROADMAP.md) — Detailed milestone schedule from Milestone 1 to 7.
- 📜 [**ADR & Decision Log**](file:///d:/TouchGrass/docs/DECISIONS.md) — Established technology decisions, proposed directions, & explicit unknowns log.
- 📊 [**Current Application State**](file:///d:/TouchGrass/docs/CURRENT_STATE.md) — Live repository implementation matrix & verification status.
- 🧪 [**Testing & Quality Strategy**](file:///d:/TouchGrass/docs/TESTING.md) — Vitest test setup, quality gates, & accessibility guidelines.
- 🔒 [**Security & Privacy**](file:///d:/TouchGrass/docs/SECURITY_PRIVACY.md) — Local-first data ownership & privacy controls.
- 🧩 [**Integrations & Adapters**](file:///d:/TouchGrass/docs/INTEGRATIONS.md) — Provider adapter specifications.
- 🛡️ [**Engineering Rules**](file:///d:/TouchGrass/AGENTS.md) — Anti-hallucination protocol & quality guidelines.

---

## 🚀 Application Sections

1. **Home — Your AI Friend** (`/`): Landing area featuring the mascot spirit centerpiece, welcome narration, and navigation cards to all 4 sections.
2. **Touch Grass Tracker** (`/tracker`): Outdoor habit journal placeholder for logging visits, photos, and outdoor streaks.
3. **Running Companion** (`/running`): Distance tracking, nature trail routes, and gentle outdoor running reminders.
4. **Nature Calendar** (`/calendar`): Astronomical events (meteor showers, full moons), seasonal blooms, and local nature phenomenon alerts.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router 7 (`createBrowserRouter`)
- **Styling**: CSS Variables + Modular CSS + 16-bit Crisp Pixel Art Rendering
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library React

---

## ⚙️ Verification Commands

```bash
# 1. Run unit & component tests
npm test

# 2. Check TypeScript type strictness
npx tsc --noEmit

# 3. Build production bundle
npm run build
```
