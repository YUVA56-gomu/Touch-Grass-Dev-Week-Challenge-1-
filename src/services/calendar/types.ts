export type EventStatus =
  | 'verified'
  | 'calculated'
  | 'forecast'
  | 'estimated'
  | 'unverified'
  | 'unavailable';

export type EventCategory =
  | 'astronomy'
  | 'sun_moon'
  | 'seasonal'
  | 'wildlife'
  | 'weather'
  | 'environmental';

export interface NatureEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  subtype: string; // e.g. "moon_phase", "meteor_shower", "solstice", "equinox", "observance"
  dateString: string; // 'YYYY-MM-DD'
  startTimeIso?: string; // e.g. "2026-10-10T18:22:00"
  endTimeIso?: string;
  isDateOnly: boolean;
  status: EventStatus;
  statusNote?: string;
  sourceName: string;
  sourceUrl?: string;
  visibilityNotes?: string;
  iconName: string; // Lucide icon key
  locationSpecific: boolean;
  latitude?: number;
  longitude?: number;
}

export interface DaylightTimes {
  dateString: string;
  sunrise: string; // "HH:MM"
  sunset: string;  // "HH:MM"
  solarNoon: string;
  dayLengthMinutes: number;
  goldenHourMorning: string;
  goldenHourEvening: string;
}

export interface MoonPhaseInfo {
  phaseFraction: number; // 0.0 to 1.0 (0=New, 0.25=First Qtr, 0.5=Full, 0.75=Third Qtr)
  phaseName: string;     // e.g. "Full Moon", "Waxing Crescent"
  illuminationPercent: number; // 0 to 100
  iconName: string;
}

export interface ICalendarEventProvider {
  getEventsForMonth(year: number, month: number, categoryFilter?: EventCategory | 'all'): Promise<NatureEvent[]>;
}
