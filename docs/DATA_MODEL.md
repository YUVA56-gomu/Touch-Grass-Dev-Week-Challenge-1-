# 🌿 TOUCH GRASS — Data Model Schemas & Storage Specification

> **Schemas for User Profile, Outdoor Visits, Photo Blobs, Running Sessions, AI Memory & Nature Calendar**

---

## 1. Local Storage Architecture

All user data is stored locally in browser **IndexedDB** (`touch_grass_db`, version 1). No personal data, notes, or photos leave the device.

### IndexedDB Object Stores (`touch_grass_db` v1)
- `visits`: Primary key `id` (UUID v4). Indices: `timestamp`, `dateString`, `photoBlobId`.
- `photos`: Primary key `id` (UUID v4). Index: `createdAt`. Contains binary `Blob` records and MIME types.

---

## 2. Data Model Schemas

### 2.1 Outdoor Visit Schema (`OutdoorVisit`)
```typescript
export interface OutdoorVisit {
  id: string;                      // UUID v4
  timestamp: number;               // Epoch millis of the visit
  dateString: string;              // Local calendar date 'YYYY-MM-DD'
  createdAt: number;               // Record creation timestamp
  updatedAt: number;               // Record last update timestamp
  durationMinutes?: number;        // Outdoor session duration in minutes
  locationName?: string;           // Optional user location label (e.g. "Pine Park")
  latitude?: number;               // Optional GPS lat
  longitude?: number;              // Optional GPS lng
  notes?: string;                  // Reflections & notes
  photoBlobId?: string;            // Foreign key in 'photos' object store
  moodBefore?: number;             // Scale 1-5
  moodAfter?: number;              // Scale 1-5
  tags: string[];                  // e.g. ["trees", "sunlight", "walk"]
}
```

### 2.2 Photo Blob Schema (`PhotoBlob`)
```typescript
export interface PhotoBlob {
  id: string;                      // Foreign key e.g. "img_v_123"
  blob: Blob;                      // Binary image file blob
  mimeType: string;                // e.g. "image/jpeg", "image/png"
  createdAt: number;               // Record creation timestamp
}
```

### 2.3 User Profile Schema (`UserProfile`)
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

### 2.4 Running Session Schema (`RunSession`)
```typescript
export interface RunSession {
  id: string;                      // UUID v4
  startTime: number;               // Epoch millis
  endTime: number;                 // Epoch millis
  distanceKm: number;              // Total distance
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

### 2.5 AI Friend Memory Schema (`AIMemory`)
```typescript
export interface AIMemory {
  id: string;                      // Session ID
  lastInteractionTimestamp: number;
  conversationTopics: string[];    // App-scoped topics discussed
  favoriteAmbientSound: string;
  userNotesSummary?: string;       // App-scoped summary for friendly context
}
```

### 2.6 Nature Calendar Event Schema (`NatureCalendarEvent`)
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
