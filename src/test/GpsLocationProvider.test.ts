import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateHaversineDistance,
  filterGpsSample,
  calculatePace,
  formatPaceString,
  formatDurationString,
} from '../services/running/gpsUtils';
import { GpsPositionSample } from '../services/running/types';
import { StorageEngine } from '../services/storage/StorageEngine';
import { DefaultRouteProvider } from '../services/running/DefaultRouteProvider';

describe('Milestone 5 — GPS Tracking, Distance & Storage Tests', () => {
  describe('Haversine Distance Formula', () => {
    it('returns 0 for identical coordinates', () => {
      const dist = calculateHaversineDistance(37.7749, -122.4194, 37.7749, -122.4194);
      expect(dist).toBe(0);
    });

    it('calculates accurate distance between known geographical coordinates', () => {
      // Distance between SF (37.7749, -122.4194) and Oakland (37.8044, -122.2712) ~13.4 km
      const dist = calculateHaversineDistance(37.7749, -122.4194, 37.8044, -122.2712);
      expect(dist).toBeGreaterThan(12.5);
      expect(dist).toBeLessThan(14.5);
    });
  });

  describe('GPS Sample Filtering Policy', () => {
    it('accepts valid initial GPS sample', () => {
      const sample: GpsPositionSample = {
        lat: 37.7749,
        lng: -122.4194,
        accuracy: 10,
        timestamp: 1000,
      };
      expect(filterGpsSample(sample)).toBe(true);
    });

    it('rejects sample with accuracy worse than 50 meters', () => {
      const sample: GpsPositionSample = {
        lat: 37.7749,
        lng: -122.4194,
        accuracy: 75, // Poor accuracy
        timestamp: 1000,
      };
      expect(filterGpsSample(sample)).toBe(false);
    });

    it('rejects duplicate coordinate samples and out-of-order timestamps', () => {
      const p1: GpsPositionSample = { lat: 37.7749, lng: -122.4194, accuracy: 10, timestamp: 1000 };
      const p2: GpsPositionSample = { lat: 37.7749, lng: -122.4194, accuracy: 10, timestamp: 2000 };
      const pOld: GpsPositionSample = { lat: 37.7750, lng: -122.4195, accuracy: 10, timestamp: 500 };

      expect(filterGpsSample(p2, p1)).toBe(false); // Duplicate position
      expect(filterGpsSample(pOld, p1)).toBe(false); // Out of order timestamp
    });

    it('rejects implausible speed jumps (> 30 km/h)', () => {
      const p1: GpsPositionSample = { lat: 37.7749, lng: -122.4194, accuracy: 10, timestamp: 1000 };
      // 10 km jump in 5 seconds = 7200 km/h (teleport jump!)
      const pTeleport: GpsPositionSample = { lat: 37.8549, lng: -122.3194, accuracy: 10, timestamp: 6000 };

      expect(filterGpsSample(pTeleport, p1)).toBe(false);
    });
  });

  describe('Pace & Duration Calculations', () => {
    it('calculates average pace in min/km', () => {
      // 2 km in 10 mins (600 secs) -> 5.0 min/km
      const pace = calculatePace(2.0, 600);
      expect(pace).toBe(5);
      expect(formatPaceString(pace)).toBe('5\'00" /km');
    });

    it('returns null for insufficient distance or time', () => {
      expect(calculatePace(0.01, 100)).toBeNull();
      expect(calculatePace(2.0, 2)).toBeNull();
      expect(formatPaceString(null)).toBe('--:--');
    });

    it('formats duration in mm:ss and hh:mm:ss', () => {
      expect(formatDurationString(65)).toBe('01:05');
      expect(formatDurationString(3665)).toBe('1:01:05');
    });
  });

  describe('StorageEngine Run Persistence & Migration Compatibility', () => {
    let engine: StorageEngine;

    beforeEach(async () => {
      engine = new StorageEngine();
      await engine.init();
      if (engine.clearAllData) {
        await engine.clearAllData();
      }
    });

    it('creates, retrieves, and deletes completed run records', async () => {
      const created = await engine.createRun({
        startTime: 1000,
        endTime: 2000,
        dateString: '2026-10-10',
        distanceKm: 3.2,
        durationSeconds: 900,
        avgPaceMinPerKm: 4.69,
        targetDistanceKm: 3.0,
        hasGpsData: true,
        isRuralFallback: false,
      });

      expect(created.id).toBeDefined();
      expect(created.distanceKm).toBe(3.2);

      let runs = await engine.getRuns();
      expect(runs.length).toBe(1);
      expect(runs[0].id).toBe(created.id);

      await engine.deleteRun(created.id);
      runs = await engine.getRuns();
      expect(runs.length).toBe(0);
    });

    it('preserves existing outdoor visit records after run store operations', async () => {
      const visit = await engine.createVisit({
        dateString: '2026-10-10',
        locationName: 'Forest Trail',
      });

      await engine.createRun({
        startTime: 1000,
        endTime: 2000,
        dateString: '2026-10-10',
        distanceKm: 1.5,
        durationSeconds: 300,
        hasGpsData: true,
        isRuralFallback: false,
      });

      const visits = await engine.getVisits();
      const runs = await engine.getRuns();

      expect(visits.length).toBe(1);
      expect(visits[0].id).toBe(visit.id);
      expect(runs.length).toBe(1);
    });
  });

  describe('Route Discovery Provider', () => {
    it('returns grounded pedestrian route candidates when OSRM fetch succeeds', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          code: 'Ok',
          routes: [
            {
              distance: 3200,
              geometry: {
                coordinates: [
                  [-122.4194, 37.7749],
                  [-122.42, 37.776],
                ],
              },
            },
          ],
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const provider = new DefaultRouteProvider();
      const candidates = await provider.getRouteCandidates(37.7749, -122.4194, 3.0);

      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0].attribution).toContain('OSRM');
      expect(candidates[0].isFallback).toBe(false);
      expect(candidates[0].waypoints.length).toBe(2);

      vi.unstubAllGlobals();
    });

    it('returns familiar-ground fallbacks when OSRM fetch fails or coordinates are missing', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      const provider = new DefaultRouteProvider();
      const candidates = await provider.getRouteCandidates(37.7749, -122.4194, 3.0);

      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0].isFallback).toBe(true);
      expect(candidates[0].name).toContain('Familiar-Ground');

      vi.unstubAllGlobals();
    });

    it('returns familiar-ground fallbacks for rural/offline requests without coordinates', async () => {
      const provider = new DefaultRouteProvider();
      const candidates = await provider.getRouteCandidates(undefined, undefined, 3.0);

      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0].isFallback).toBe(true);
      expect(candidates[0].name).toContain('Familiar-Ground');
    });
  });
});
