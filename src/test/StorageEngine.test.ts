import { describe, it, expect, beforeEach } from 'vitest';
import { StorageEngine } from '../services/storage/StorageEngine';
import {
  getLocalDateString,
  parseLocalDateString,
  getPreviousLocalDateString,
  getNextLocalDateString,
  calculateTrackerStats,
} from '../services/storage/streakUtils';
import { OutdoorVisit } from '../services/storage/types';

describe('Milestone 4 — StorageEngine & Streak Utilities Tests', () => {
  describe('Streak & Date Calculation Utilities', () => {
    it('formats local dates consistently without UTC boundary shifts', () => {
      const d = new Date(2026, 9, 10, 14, 30); // Oct 10, 2026 14:30 local time
      const dateStr = getLocalDateString(d);
      expect(dateStr).toBe('2026-10-10');

      const parsed = parseLocalDateString('2026-10-10');
      expect(parsed.getFullYear()).toBe(2026);
      expect(parsed.getMonth()).toBe(9); // 0-indexed
      expect(parsed.getDate()).toBe(10);
    });

    it('calculates previous and next local dates correctly', () => {
      expect(getPreviousLocalDateString('2026-10-10')).toBe('2026-10-09');
      expect(getNextLocalDateString('2026-10-10')).toBe('2026-10-11');

      // Month boundary
      expect(getPreviousLocalDateString('2026-10-01')).toBe('2026-09-30');
      expect(getNextLocalDateString('2026-09-30')).toBe('2026-10-01');

      // Year boundary
      expect(getPreviousLocalDateString('2026-01-01')).toBe('2025-12-31');
      expect(getNextLocalDateString('2025-12-31')).toBe('2026-01-01');
    });

    it('handles empty visits array gracefully', () => {
      const stats = calculateTrackerStats([], '2026-10-10');
      expect(stats.totalVisits).toBe(0);
      expect(stats.distinctOutdoorDays).toBe(0);
      expect(stats.currentStreak).toBe(0);
      expect(stats.longestStreak).toBe(0);
    });

    it('counts multiple visits on the same date as 1 distinct outdoor day and 1 streak step', () => {
      const mockVisits: OutdoorVisit[] = [
        { id: '1', timestamp: 1000, dateString: '2026-10-10', createdAt: 1000, updatedAt: 1000, durationMinutes: 20, tags: [] },
        { id: '2', timestamp: 2000, dateString: '2026-10-10', createdAt: 2000, updatedAt: 2000, durationMinutes: 40, tags: [] },
      ];

      const stats = calculateTrackerStats(mockVisits, '2026-10-10');
      expect(stats.totalVisits).toBe(2);
      expect(stats.distinctOutdoorDays).toBe(1);
      expect(stats.totalDurationMinutes).toBe(60);
      expect(stats.currentStreak).toBe(1);
      expect(stats.longestStreak).toBe(1);
    });

    it('calculates consecutive streaks and preserves current streak if last visit was yesterday', () => {
      const mockVisits: OutdoorVisit[] = [
        { id: '1', timestamp: 1000, dateString: '2026-10-08', createdAt: 1000, updatedAt: 1000, tags: [] },
        { id: '2', timestamp: 2000, dateString: '2026-10-09', createdAt: 2000, updatedAt: 2000, tags: [] },
      ];

      // Reference date is Oct 10 (today). Visited yesterday (Oct 9) and day before (Oct 8).
      const stats = calculateTrackerStats(mockVisits, '2026-10-10');
      expect(stats.distinctOutdoorDays).toBe(2);
      expect(stats.currentStreak).toBe(2);
      expect(stats.longestStreak).toBe(2);
    });

    it('resets current streak to 0 if last visit was before yesterday', () => {
      const mockVisits: OutdoorVisit[] = [
        { id: '1', timestamp: 1000, dateString: '2026-10-07', createdAt: 1000, updatedAt: 1000, tags: [] },
      ];

      // Reference date Oct 10. Last visit Oct 7 (gap of >1 day)
      const stats = calculateTrackerStats(mockVisits, '2026-10-10');
      expect(stats.currentStreak).toBe(0);
      expect(stats.longestStreak).toBe(1);
    });

    it('unlocks achievement milestones deterministically based on progress', () => {
      const mockVisits: OutdoorVisit[] = [
        { id: '1', timestamp: 1000, dateString: '2026-10-10', createdAt: 1000, updatedAt: 1000, tags: [] },
      ];

      const stats = calculateTrackerStats(mockVisits, '2026-10-10');
      const firstStepBadge = stats.achievements.find(a => a.id === 'first_step');
      expect(firstStepBadge?.unlocked).toBe(true);

      const streak3Badge = stats.achievements.find(a => a.id === 'streak_3');
      expect(streak3Badge?.unlocked).toBe(false);
    });
  });

  describe('StorageEngine CRUD Operations', () => {
    let engine: StorageEngine;

    beforeEach(async () => {
      engine = new StorageEngine();
      await engine.init();
      if (engine.clearAllData) {
        await engine.clearAllData();
      }
    });

    it('creates, retrieves, and updates an outdoor visit record', async () => {
      const created = await engine.createVisit({
        dateString: '2026-10-10',
        durationMinutes: 30,
        locationName: 'Pine Forest',
        notes: 'Felt very relaxed',
      });

      expect(created.id).toBeDefined();
      expect(created.locationName).toBe('Pine Forest');
      expect(created.durationMinutes).toBe(30);

      const visits = await engine.getVisits();
      expect(visits.length).toBe(1);
      expect(visits[0].id).toBe(created.id);

      const updated = await engine.updateVisit(created.id, {
        dateString: '2026-10-10',
        durationMinutes: 45,
        locationName: 'Pine Forest Sanctuary',
        notes: 'Felt super energized!',
      });

      expect(updated.durationMinutes).toBe(45);
      expect(updated.locationName).toBe('Pine Forest Sanctuary');
    });

    it('deletes an outdoor visit record and updates summary stats', async () => {
      const created = await engine.createVisit({
        dateString: '2026-10-10',
        durationMinutes: 20,
        locationName: 'Local Park',
      });

      let visits = await engine.getVisits();
      expect(visits.length).toBe(1);

      await engine.deleteVisit(created.id);

      visits = await engine.getVisits();
      expect(visits.length).toBe(0);

      const summary = await engine.getActivitySummary();
      expect(summary.totalVisits).toBe(0);
      expect(summary.distinctOutdoorDays).toBe(0);
    });

    it('rejects photo files larger than 5MB with clear error message', async () => {
      // Create fake 6MB file
      const largeBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'image/jpeg' });
      const largeFile = new File([largeBlob], 'huge.jpg', { type: 'image/jpeg' });

      await expect(
        engine.createVisit({
          dateString: '2026-10-10',
          photoFile: largeFile,
        })
      ).rejects.toThrow(/exceeds 5MB/);
    });
  });
});
