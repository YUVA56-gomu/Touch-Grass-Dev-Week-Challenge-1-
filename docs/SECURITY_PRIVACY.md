# 🌿 TOUCH GRASS — Security & Privacy Architecture

> **Privacy-First Data Principles, Geolocation Protection, and Security Controls**

---

## 1. Privacy Principles

1. **Local-First Data Ownership**: All outdoor visit notes, personal photos, and running coordinates remain stored locally in browser IndexedDB.
2. **Zero Unsolicited Location Tracking**: GPS coordinates are accessed only when the user explicitly starts a running session or location-based event query.
3. **No Hidden Telemetry**: No third-party tracking scripts, analytics cookies, or behavioral advertising SDKs are included.

---

## 2. API Key & Credential Protection

- **No Secret Hardcoding**: API keys for external AI providers or map tiles MUST NEVER be stored in frontend code or committed to git.
- **FastAPI Gateway Proxy**: Production credentials reside strictly in server-side environment variables (`.env`) accessed via the FastAPI backend proxy.

---

## 3. Data Retention & Clearing

Users retain 100% control over their local data. A single-click "Clear All Data" action purges the IndexedDB database completely from the user's browser.
