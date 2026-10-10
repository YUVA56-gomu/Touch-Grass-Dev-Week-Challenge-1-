import {
  ICalendarEventProvider,
  NatureEvent,
  EventCategory,
  DaylightTimes,
  MoonPhaseInfo,
} from './types';
import {
  getAstronomicalEventsForMonth,
  calculateDaylightTimes,
  calculateMoonPhase,
} from './astronomyEngine';
import { defaultSeasonalProvider } from './SeasonalNatureProvider';

export class CompositeCalendarProvider implements ICalendarEventProvider {
  private seasonalProvider: ICalendarEventProvider;

  constructor(seasonalProvider: ICalendarEventProvider = defaultSeasonalProvider) {
    this.seasonalProvider = seasonalProvider;
  }

  public async getEventsForMonth(
    year: number,
    month: number,
    categoryFilter: EventCategory | 'all' = 'all'
  ): Promise<NatureEvent[]> {
    const astroEvents = getAstronomicalEventsForMonth(year, month);
    const seasonalEvents = await this.seasonalProvider.getEventsForMonth(year, month);

    const allEvents = [...astroEvents, ...seasonalEvents];

    const filtered = allEvents.filter((evt) => {
      if (categoryFilter === 'all') return true;
      return evt.category === categoryFilter;
    });

    // Sort chronologically ascending
    return filtered.sort((a, b) => a.dateString.localeCompare(b.dateString));
  }

  public getDaylightTimes(dateStr: string, lat?: number): DaylightTimes {
    return calculateDaylightTimes(dateStr, lat);
  }

  public getMoonPhase(dateStr: string): MoonPhaseInfo {
    return calculateMoonPhase(dateStr);
  }
}

export const defaultCompositeCalendarProvider = new CompositeCalendarProvider();
