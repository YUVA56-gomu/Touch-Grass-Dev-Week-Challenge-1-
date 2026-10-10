import { describe, it, expect } from 'vitest';
import {
  calculateMoonPhase,
  calculateDaylightTimes,
  getAstronomicalEventsForMonth,
} from '../services/calendar/astronomyEngine';
import { SeasonalNatureProvider } from '../services/calendar/SeasonalNatureProvider';
import { CompositeCalendarProvider } from '../services/calendar/CompositeCalendarProvider';

describe('Milestone 6 — Astronomy Engine & Event Provider Tests', () => {
  describe('Moon Phase Calculation Engine', () => {
    it('calculates New Moon (approx 0% illumination) at epoch', () => {
      const moonInfo = calculateMoonPhase('2020-01-25');
      expect(moonInfo.phaseName).toBe('New Moon');
      expect(moonInfo.illuminationPercent).toBeLessThanOrEqual(5);
    });

    it('calculates Full Moon (approx 100% illumination) half synodic month later', () => {
      // ~14.76 days after Jan 25, 2020 is Full Moon (Feb 9, 2020)
      const moonInfo = calculateMoonPhase('2020-02-09');
      expect(moonInfo.phaseName).toBe('Full Moon');
      expect(moonInfo.illuminationPercent).toBeGreaterThanOrEqual(95);
    });
  });

  describe('Daylight Sunrise / Sunset Math', () => {
    it('computes realistic daylight times and golden hours', () => {
      const daylight = calculateDaylightTimes('2026-10-10', 37.7749);
      expect(daylight.sunrise).toBeDefined();
      expect(daylight.sunset).toBeDefined();
      expect(daylight.dayLengthMinutes).toBeGreaterThan(600); // ~10+ hours
      expect(daylight.goldenHourMorning).toContain('-');
      expect(daylight.goldenHourEvening).toContain('-');
    });
  });

  describe('Astronomical Events Catalog & Solstices', () => {
    it('generates March Equinox, June Solstice, Sept Equinox, Dec Solstice', () => {
      const marEvents = getAstronomicalEventsForMonth(2026, 3);
      const junEvents = getAstronomicalEventsForMonth(2026, 6);
      const sepEvents = getAstronomicalEventsForMonth(2026, 9);
      const decEvents = getAstronomicalEventsForMonth(2026, 12);

      expect(marEvents.some((e) => e.title.includes('March Vernal Equinox'))).toBe(true);
      expect(junEvents.some((e) => e.title.includes('June Summer Solstice'))).toBe(true);
      expect(sepEvents.some((e) => e.title.includes('September Autumnal Equinox'))).toBe(true);
      expect(decEvents.some((e) => e.title.includes('December Winter Solstice'))).toBe(true);
    });

    it('includes verified Perseid meteor shower peak date in August', () => {
      const augEvents = getAstronomicalEventsForMonth(2026, 8);
      const perseids = augEvents.find((e) => e.id.includes('perseids'));

      expect(perseids).toBeDefined();
      expect(perseids?.status).toBe('verified');
      expect(perseids?.sourceName).toContain('International Meteor Organization');
    });

    it('includes 2026 Total Solar Eclipse reference on August 12, 2026', () => {
      const augEvents = getAstronomicalEventsForMonth(2026, 8);
      const eclipse = augEvents.find((e) => e.id === 'astro_total_solar_eclipse_2026');

      expect(eclipse).toBeDefined();
      expect(eclipse?.status).toBe('verified');
      expect(eclipse?.sourceName).toContain('NASA');
    });
  });

  describe('SeasonalNatureProvider & Composite Engine', () => {
    it('returns verified Earth Day observance on April 22', async () => {
      const provider = new SeasonalNatureProvider();
      const aprEvents = await provider.getEventsForMonth(2026, 4);

      const earthDay = aprEvents.find((e) => e.id.includes('earth_day'));
      expect(earthDay).toBeDefined();
      expect(earthDay?.status).toBe('verified');
      expect(earthDay?.sourceName).toContain('EarthDay.org');
    });

    it('filters and sorts events chronologically ascending in CompositeCalendarProvider', async () => {
      const composite = new CompositeCalendarProvider();
      const allOctober = await composite.getEventsForMonth(2026, 10, 'all');

      expect(allOctober.length).toBeGreaterThan(0);

      // Verify ascending date order
      for (let i = 1; i < allOctober.length; i++) {
        expect(allOctober[i].dateString >= allOctober[i - 1].dateString).toBe(true);
      }

      // Filter by category
      const astroOctober = await composite.getEventsForMonth(2026, 10, 'astronomy');
      expect(astroOctober.every((e) => e.category === 'astronomy')).toBe(true);
    });
  });
});
