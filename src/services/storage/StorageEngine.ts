import {
  OutdoorVisit,
  PhotoBlob,
  RunRecord,
  ActivitySummary,
  VisitFormData,
  IStorageEngine,
} from './types';
import { calculateTrackerStats, getLocalDateString } from './streakUtils';

const DB_NAME = 'touch_grass_db';
const DB_VERSION = 2; // Incremented for Milestone 5 Running Session store addition
const VISITS_STORE = 'visits';
const PHOTOS_STORE = 'photos';
const RUNS_STORE = 'runs';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export class StorageEngine implements IStorageEngine {
  private db: IDBDatabase | null = null;
  private isFallbackMode = false;

  // In-memory fallback structures if IndexedDB is blocked or unsupported
  private memoryVisits: Map<string, OutdoorVisit> = new Map();
  private memoryPhotos: Map<string, PhotoBlob> = new Map();
  private memoryRuns: Map<string, RunRecord> = new Map();

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'r_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  }

  public async init(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.warn('IndexedDB not supported in this environment. Falling back to in-memory storage.');
      this.isFallbackMode = true;
      return;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(VISITS_STORE)) {
            const visitStore = db.createObjectStore(VISITS_STORE, { keyPath: 'id' });
            visitStore.createIndex('timestamp', 'timestamp', { unique: false });
            visitStore.createIndex('dateString', 'dateString', { unique: false });
            visitStore.createIndex('photoBlobId', 'photoBlobId', { unique: false });
          }

          if (!db.objectStoreNames.contains(PHOTOS_STORE)) {
            const photoStore = db.createObjectStore(PHOTOS_STORE, { keyPath: 'id' });
            photoStore.createIndex('createdAt', 'createdAt', { unique: false });
          }

          if (!db.objectStoreNames.contains(RUNS_STORE)) {
            const runStore = db.createObjectStore(RUNS_STORE, { keyPath: 'id' });
            runStore.createIndex('startTime', 'startTime', { unique: false });
            runStore.createIndex('dateString', 'dateString', { unique: false });
          }
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onerror = () => {
          console.warn('IndexedDB initialization failed. Falling back to in-memory storage:', request.error);
          this.isFallbackMode = true;
          resolve(); // Resolve so app gracefully continues in fallback mode
        };
      } catch (err) {
        console.warn('IndexedDB exception during init. Falling back to in-memory storage:', err);
        this.isFallbackMode = true;
        resolve();
      }
    });
  }

  public async createVisit(data: VisitFormData): Promise<OutdoorVisit> {
    const id = this.generateId();
    const now = Date.now();

    let dateString = data.dateString;
    if (!dateString) {
      dateString = getLocalDateString(now);
    }

    let photoBlobId: string | undefined = undefined;

    if (data.photoFile) {
      photoBlobId = await this.savePhoto(data.photoFile);
    }

    const newVisit: OutdoorVisit = {
      id,
      timestamp: now,
      dateString,
      createdAt: now,
      updatedAt: now,
      durationMinutes: data.durationMinutes,
      locationName: data.locationName?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      photoBlobId,
      moodBefore: data.moodBefore,
      moodAfter: data.moodAfter,
      tags: data.tags || [],
    };

    if (this.isFallbackMode || !this.db) {
      this.memoryVisits.set(id, newVisit);
      return newVisit;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([VISITS_STORE], 'readwrite');
        const store = tx.objectStore(VISITS_STORE);
        const req = store.add(newVisit);

        req.onsuccess = () => resolve(newVisit);
        req.onerror = () => reject(req.error || new Error('Failed to save visit record'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getVisits(): Promise<OutdoorVisit[]> {
    if (this.isFallbackMode || !this.db) {
      const visits = Array.from(this.memoryVisits.values());
      return visits.sort((a, b) => b.timestamp - a.timestamp);
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([VISITS_STORE], 'readonly');
        const store = tx.objectStore(VISITS_STORE);
        const req = store.getAll();

        req.onsuccess = () => {
          const visits = (req.result as OutdoorVisit[]) || [];
          visits.sort((a, b) => b.timestamp - a.timestamp);
          resolve(visits);
        };

        req.onerror = () => reject(req.error || new Error('Failed to retrieve visits'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getVisitById(id: string): Promise<OutdoorVisit | null> {
    if (this.isFallbackMode || !this.db) {
      return this.memoryVisits.get(id) || null;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([VISITS_STORE], 'readonly');
        const store = tx.objectStore(VISITS_STORE);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error || new Error(`Failed to find visit ${id}`));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async updateVisit(id: string, data: VisitFormData): Promise<OutdoorVisit> {
    const existing = await this.getVisitById(id);
    if (!existing) {
      throw new Error(`Visit with ID ${id} not found.`);
    }

    const now = Date.now();
    let photoBlobId = existing.photoBlobId;

    if (data.removeExistingPhoto || data.photoFile) {
      if (existing.photoBlobId) {
        await this.deletePhotoIfOrphaned(existing.photoBlobId, id);
        photoBlobId = undefined;
      }
    }

    if (data.photoFile) {
      photoBlobId = await this.savePhoto(data.photoFile);
    }

    const updatedVisit: OutdoorVisit = {
      ...existing,
      dateString: data.dateString || existing.dateString,
      durationMinutes: data.durationMinutes,
      locationName: data.locationName?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      photoBlobId,
      moodBefore: data.moodBefore,
      moodAfter: data.moodAfter,
      tags: data.tags || existing.tags,
      updatedAt: now,
    };

    if (this.isFallbackMode || !this.db) {
      this.memoryVisits.set(id, updatedVisit);
      return updatedVisit;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([VISITS_STORE], 'readwrite');
        const store = tx.objectStore(VISITS_STORE);
        const req = store.put(updatedVisit);

        req.onsuccess = () => resolve(updatedVisit);
        req.onerror = () => reject(req.error || new Error('Failed to update visit record'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async deleteVisit(id: string): Promise<void> {
    const existing = await this.getVisitById(id);
    if (!existing) return;

    if (existing.photoBlobId) {
      await this.deletePhotoIfOrphaned(existing.photoBlobId, id);
    }

    if (this.isFallbackMode || !this.db) {
      this.memoryVisits.delete(id);
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([VISITS_STORE], 'readwrite');
        const store = tx.objectStore(VISITS_STORE);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Failed to delete visit record'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getPhotoBlob(photoBlobId: string): Promise<Blob | null> {
    if (this.isFallbackMode || !this.db) {
      const p = this.memoryPhotos.get(photoBlobId);
      return p ? p.blob : null;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([PHOTOS_STORE], 'readonly');
        const store = tx.objectStore(PHOTOS_STORE);
        const req = store.get(photoBlobId);

        req.onsuccess = () => {
          const item = req.result as PhotoBlob | undefined;
          resolve(item ? item.blob : null);
        };
        req.onerror = () => reject(req.error || new Error('Failed to load photo blob'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getActivitySummary(): Promise<ActivitySummary> {
    const visits = await this.getVisits();
    return calculateTrackerStats(visits);
  }

  /* Running Companion Store Operations */
  public async createRun(runData: Omit<RunRecord, 'id'>): Promise<RunRecord> {
    const id = this.generateId();
    const newRun: RunRecord = {
      ...runData,
      id,
    };

    if (this.isFallbackMode || !this.db) {
      this.memoryRuns.set(id, newRun);
      return newRun;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([RUNS_STORE], 'readwrite');
        const store = tx.objectStore(RUNS_STORE);
        const req = store.add(newRun);

        req.onsuccess = () => resolve(newRun);
        req.onerror = () => reject(req.error || new Error('Failed to save run session record'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getRuns(): Promise<RunRecord[]> {
    if (this.isFallbackMode || !this.db) {
      const runs = Array.from(this.memoryRuns.values());
      return runs.sort((a, b) => b.startTime - a.startTime);
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([RUNS_STORE], 'readonly');
        const store = tx.objectStore(RUNS_STORE);
        const req = store.getAll();

        req.onsuccess = () => {
          const runs = (req.result as RunRecord[]) || [];
          runs.sort((a, b) => b.startTime - a.startTime);
          resolve(runs);
        };

        req.onerror = () => reject(req.error || new Error('Failed to retrieve run records'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async deleteRun(id: string): Promise<void> {
    if (this.isFallbackMode || !this.db) {
      this.memoryRuns.delete(id);
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([RUNS_STORE], 'readwrite');
        const store = tx.objectStore(RUNS_STORE);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Failed to delete run record'));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async clearAllData(): Promise<void> {
    this.memoryVisits.clear();
    this.memoryPhotos.clear();
    this.memoryRuns.clear();

    if (this.db) {
      return new Promise((resolve, reject) => {
        try {
          const tx = this.db!.transaction([VISITS_STORE, PHOTOS_STORE, RUNS_STORE], 'readwrite');
          tx.objectStore(VISITS_STORE).clear();
          tx.objectStore(PHOTOS_STORE).clear();
          tx.objectStore(RUNS_STORE).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        } catch (err) {
          reject(err);
        }
      });
    }
  }

  /* Photo Management Internal Helpers */
  private async savePhoto(file: File): Promise<string> {
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      throw new Error(`Photo size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).`);
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported image format (${file.type}). Please attach JPEG, PNG, WebP, or GIF.`);
    }

    const photoId = 'img_' + this.generateId();
    const photoBlobRecord: PhotoBlob = {
      id: photoId,
      blob: file,
      mimeType: file.type || 'image/jpeg',
      createdAt: Date.now(),
    };

    if (this.isFallbackMode || !this.db) {
      this.memoryPhotos.set(photoId, photoBlobRecord);
      return photoId;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([PHOTOS_STORE], 'readwrite');
        const store = tx.objectStore(PHOTOS_STORE);
        const req = store.add(photoBlobRecord);

        req.onsuccess = () => resolve(photoId);
        req.onerror = () => reject(req.error || new Error('Failed to save photo blob'));
      } catch (err) {
        reject(err);
      }
    });
  }

  private async deletePhotoIfOrphaned(photoBlobId: string, currentVisitId: string): Promise<void> {
    const allVisits = await this.getVisits();
    const otherVisitsWithPhoto = allVisits.filter(
      v => v.id !== currentVisitId && v.photoBlobId === photoBlobId
    );

    if (otherVisitsWithPhoto.length === 0) {
      if (this.isFallbackMode || !this.db) {
        this.memoryPhotos.delete(photoBlobId);
        return;
      }

      return new Promise((resolve) => {
        try {
          const tx = this.db!.transaction([PHOTOS_STORE], 'readwrite');
          const store = tx.objectStore(PHOTOS_STORE);
          const req = store.delete(photoBlobId);
          req.onsuccess = () => resolve();
          req.onerror = () => resolve(); // Non-fatal if missing
        } catch (e) {
          resolve();
        }
      });
    }
  }
}

// Singleton export
export const defaultStorageEngine = new StorageEngine();
