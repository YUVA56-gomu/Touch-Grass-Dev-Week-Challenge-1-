export interface OutdoorVisit {
  id: string;
  timestamp: number;              // Epoch millis of the visit
  dateString: string;             // Local calendar date 'YYYY-MM-DD'
  createdAt: number;              // Record creation time
  updatedAt: number;              // Record last update time
  durationMinutes?: number;        // Outdoor session duration in minutes
  locationName?: string;          // Optional location label (e.g. "Greenwood Park")
  latitude?: number;              // Optional GPS latitude
  longitude?: number;             // Optional GPS longitude
  notes?: string;                 // Reflections & notes
  photoBlobId?: string;           // Foreign key in 'photos' object store
  moodBefore?: number;            // 1 to 5 scale
  moodAfter?: number;             // 1 to 5 scale
  tags: string[];                 // Custom or preset tags
}

export interface PhotoBlob {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

export interface RunRecord {
  id: string;
  startTime: number;              // Epoch millis
  endTime: number;                // Epoch millis
  dateString: string;             // Local calendar date 'YYYY-MM-DD'
  distanceKm: number;             // Measured distance in km
  durationSeconds: number;        // Active duration in seconds (excluding paused time)
  avgPaceMinPerKm?: number;       // Pace in min/km
  targetDistanceKm?: number;      // Target goal distance in km
  hasGpsData: boolean;            // True if session had valid GPS coordinates
  pathCoordinates?: Array<{
    lat: number;
    lng: number;
    timestamp: number;
  }>;
  isRuralFallback: boolean;       // True if timed or offline familiar-ground session
  notes?: string;
}

export interface AchievementMilestone {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface ActivitySummary {
  totalVisits: number;
  distinctOutdoorDays: number;
  totalDurationMinutes: number;
  currentStreak: number;
  longestStreak: number;
  achievements: AchievementMilestone[];
}

export interface VisitFormData {
  dateString: string;
  durationMinutes?: number;
  locationName?: string;
  notes?: string;
  moodBefore?: number;
  moodAfter?: number;
  tags?: string[];
  photoFile?: File | null;
  removeExistingPhoto?: boolean;
}

export interface IStorageEngine {
  init(): Promise<void>;
  createVisit(data: VisitFormData): Promise<OutdoorVisit>;
  getVisits(): Promise<OutdoorVisit[]>;
  getVisitById(id: string): Promise<OutdoorVisit | null>;
  updateVisit(id: string, data: VisitFormData): Promise<OutdoorVisit>;
  deleteVisit(id: string): Promise<void>;
  getPhotoBlob(photoBlobId: string): Promise<Blob | null>;
  getActivitySummary(): Promise<ActivitySummary>;

  // Running Companion Operations
  createRun(run: Omit<RunRecord, 'id'>): Promise<RunRecord>;
  getRuns(): Promise<RunRecord[]>;
  deleteRun(id: string): Promise<void>;

  clearAllData?(): Promise<void>;
}
