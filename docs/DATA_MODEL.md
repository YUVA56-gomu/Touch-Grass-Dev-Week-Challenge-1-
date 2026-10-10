# 🌿 TOUCH GRASS — Data Model Schemas & Storage Specification

> **Schemas for User Profile, Outdoor Visits, Running Sessions, AI Memory & Nature Calendar**

---

## 1. Local Storage Architecture

All user data is stored locally in browser **IndexedDB** (`touch_grass_db`, version 1). No personal data or location coordinates leave the device unless explicitly synced.

---

## 2. Data Model Schemas

### 2.1 User Profile Schema (`UserProfile`)
```typescript
export interface UserProfile {
  id: string;                      // e.g. "usr_local"
  displayName: string;             // e.g. "Nature Explorer"
  createdTimestamp: number;        // Epoch millis
  preferences: {
    audioEnabled: boolean;
    ambientSound: 'forest' | 'meadow' | 'rain' | 'none';
    preferredRunDistanceKm: number;
    reducedMotion: boolean;
  };
}
```

### 2.2 Outdoor Visit Schema (`OutdoorVisit`)
```typescript
export interface OutdoorVisit {
  id: string;                      // UUID v4
  timestamp: number;               // Epoch millis
  durationMinutes: number;         // Duration outdoors
  locationName?: string;           // Optional user label (e.g. "Oak Park")
  latitude?: number;               // Optional GPS lat
  longitude?: number;              // Optional GPS lng
  notes?: string;                  // User reflection notes
  photoBlobId?: string;            // Key in IndexedDB photo store
  moodBefore?: number;             // Scale 1-5
  moodAfter?: number;              // Scale 1-5
  tags: string[];                  // e.g. ["trees", "sunlight", "walk"]
}
```

### 2.3 Running Session Schema (`RunSession`)
```typescript
export interface RunSession {
  id: string;                      // UUID v4
  startTime: number;               // Epoch millis
  endTime: number;                 // Epoch millis
  distanceKm: number;              // Total distance (deterministic math)
  durationSeconds: number;         // Total active duration
  avgPaceMinPerKm: number;         // Calculated pace
  pathCoordinates: Array<{
    lat: number;
    lng: number;
    timestamp: number;
  }>;
  isRuralFallback: boolean;        // True if offline / no map tiles
}
```

### 2.4 AI Friend Memory Schema (`AIMemory`)
```typescript
export interface AIMemory {
  id: string;                      // Session ID
  lastInteractionTimestamp: number;
  conversationTopics: string[];    // App-scoped topics discussed
  favoriteAmbientSound: string;
  userNotesSummary?: string;       // App-scoped summary for friendly context
}
```

### 2.5 Nature Calendar Event Schema (`NatureCalendarEvent`)
```typescript
export interface NatureCalendarEvent {
  id: string;                      // e.g. "evt_perseids_2026"
  title: string;                   // Event name
  category: 'astronomy' | 'seasonal' | 'wildlife' | 'weather' | 'local';
  startTimestamp: number;          // Event start
  endTimestamp: number;            // Event end
  status: 'calculated' | 'forecast' | 'seasonal-estimate' | 'verified';
  description: string;             // Educational summary
  iconName: string;                // Lucide icon key
  locationSpecific: boolean;
}
```
