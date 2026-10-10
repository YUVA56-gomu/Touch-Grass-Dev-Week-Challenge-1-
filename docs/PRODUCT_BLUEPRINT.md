# 🌿 TOUCH GRASS — Product Blueprint & Scope Specification

> **Single Source of Truth** for Product Features, Sections, and Milestones.

---

## 1. Product Vision & Mission

TOUCH GRASS is an independent, non-judgmental application designed to help people reconnect with nature through a kind 16-bit AI friend, guided nature breaks, outdoor habit tracking, non-competitive running adventures, and a natural events calendar.

**Core Philosophy**: *The virtual world is the invitation. The real world is the destination.*

---

## 2. Product Truth: The Four Primary Sections

### 01 · Home: Your AI Friend
- **Agreed Purpose**: Friendly conversation, voice interaction, app-scoped memory, and guided imagination sessions accompanied by nature ambience.
- **Current Foundation**: 16-bit lime teardrop mascot centerpiece (`MascotDisplay.tsx`), welcome greeting, "Let's Relax" nature prompt trigger, and navigation links to other sections.
- **Planned Features**: Multi-turn text/voice AI conversation, session story narration, ambient background audio player, session history memory.

### 02 · Touch Grass Tracker
- **Agreed Purpose**: Outdoor visit logging, optional memory photos, progress milestones, and outdoor habit streaks.
- **Current Foundation**: Section overview page and clear placeholder state (`TrackerPage.tsx`).
- **Planned Features**: Local-first visit entry form, IndexedDB persistence, photo attachment viewer, streak counter, spirit badge unlocks.

### 03 · Running Companion
- **Agreed Purpose**: Gentle run reminders, distance selection, mapped route candidates, GPS trail tracking, and rural/offline fallback behavior.
- **Current Foundation**: Section overview page and clear placeholder state (`RunningPage.tsx`).
- **Planned Features**: Non-competitive run distance picker, interactive map route visualizer, live GPS location tracker, offline rural route cache.

### 04 · Nature Calendar
- **Agreed Purpose**: Astronomy events, daily sky times (sunrise/sunset/golden hour), seasonal transitions, wildlife occurrences, weather-dependent phenomena, environmental occasions, and local outdoor events.
- **Current Foundation**: Section overview page and clear placeholder state (`CalendarPage.tsx`).
- **Planned Features**: Astronomical calendar calculations, verified status badges (Calculated vs Seasonal vs Verified), category filters, environmental event alerts.

---

## 3. Milestone Release Plan

- **Milestone 1 (Complete)**: Project foundation, visual identity, responsive navigation shell, 4 section routes, pixel UI design system.
- **Milestone 2 (Complete)**: Documentation, architecture lock-in, ADR decisions, anti-hallucination protocol.
- **Milestone 3 (Planned)**: AI Friend conversation engine, voice/audio provider interface, ambient audio engine.
- **Milestone 4 (Planned)**: Touch Grass Tracker & IndexedDB local-first storage.
- **Milestone 5 (Planned)**: Running Companion GPS tracker & map route provider.
- **Milestone 6 (Planned)**: Nature Calendar astronomical calculation engine & event feed.
- **Milestone 7 (Planned)**: Final Polish, performance verification, and hackathon presentation bundle.
