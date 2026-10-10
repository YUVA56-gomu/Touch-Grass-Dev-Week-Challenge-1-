import { ICalendarEventProvider, NatureEvent } from './types';

export class SeasonalNatureProvider implements ICalendarEventProvider {
  public async getEventsForMonth(
    year: number,
    month: number
  ): Promise<NatureEvent[]> {
    const events: NatureEvent[] = [];

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // March Observances & Seasonal
      if (month === 3 && day === 21) {
        events.push({
          id: `env_forests_${dayStr}`,
          title: 'International Day of Forests',
          description: 'A global day celebrating the vital role of forests, trees, and woodland ecosystems.',
          category: 'environmental',
          subtype: 'observance',
          dateString: dayStr,
          isDateOnly: true,
          status: 'verified',
          statusNote: 'United Nations Official Observance',
          sourceName: 'United Nations Environment Programme (UNEP)',
          sourceUrl: 'https://www.unep.org',
          visibilityNotes: 'Celebrate by spending time under canopy trees or visiting a forest reserve.',
          iconName: 'Trees',
          locationSpecific: false,
        });
      }

      // April Observances & Seasonal
      if (month === 4 && day === 15) {
        events.push({
          id: `seasonal_spring_blossoms_${dayStr}`,
          title: 'Spring Wildflower & Blossom Peak',
          description: 'Estimated peak window for spring woodland wildflowers and park tree blossoms.',
          category: 'seasonal',
          subtype: 'botanical',
          dateString: dayStr,
          isDateOnly: true,
          status: 'estimated',
          statusNote: 'Estimated seasonal timing based on regional bloom phenology',
          sourceName: 'National Phenology Network (NPN)',
          visibilityNotes: 'Check local park gardens and nature trails for blooming flora.',
          iconName: 'Flower2',
          locationSpecific: false,
        });
      }

      if (month === 4 && day === 22) {
        events.push({
          id: `env_earth_day_${dayStr}`,
          title: 'Earth Day 2026',
          description: 'Worldwide observance encouraging environmental stewardship, nature protection, and outdoors action.',
          category: 'environmental',
          subtype: 'observance',
          dateString: dayStr,
          isDateOnly: true,
          status: 'verified',
          statusNote: 'Verified international observance',
          sourceName: 'EarthDay.org Official Portal',
          sourceUrl: 'https://www.earthday.org',
          visibilityNotes: 'Participate in a local park cleanup or plant native vegetation.',
          iconName: 'Globe',
          locationSpecific: false,
        });
      }

      if (month === 4 && day === 24) {
        events.push({
          id: `env_arbor_day_${dayStr}`,
          title: 'Arbor Day Tree Celebration',
          description: 'Dedicated day for planting trees and recognizing forest conservation.',
          category: 'environmental',
          subtype: 'observance',
          dateString: dayStr,
          isDateOnly: true,
          status: 'verified',
          statusNote: 'Verified Arbor Day Foundation Date',
          sourceName: 'Arbor Day Foundation',
          sourceUrl: 'https://www.arborday.org',
          visibilityNotes: 'Plant a tree or visit a local arboretum.',
          iconName: 'Trees',
          locationSpecific: false,
        });
      }

      // May Wildlife
      if (month === 5 && day === 9) {
        events.push({
          id: `wildlife_bird_day_${dayStr}`,
          title: 'World Migratory Bird Day',
          description: 'Highlighting the conservation of migratory birds and their natural wetland and forest habitats.',
          category: 'wildlife',
          subtype: 'migration',
          dateString: dayStr,
          isDateOnly: true,
          status: 'verified',
          statusNote: 'Verified international wildlife observance',
          sourceName: 'Environment for the Americas / CMS',
          sourceUrl: 'https://www.migratorybirdday.org',
          visibilityNotes: 'Bring binoculars to local wetlands or park preserves for birdwatching.',
          iconName: 'Bird',
          locationSpecific: false,
        });
      }

      // June Observances
      if (month === 6 && day === 5) {
        events.push({
          id: `env_world_env_day_${dayStr}`,
          title: 'World Environment Day',
          description: 'United Nations flagship day for inspiring environmental action and outdoor conservation.',
          category: 'environmental',
          subtype: 'observance',
          dateString: dayStr,
          isDateOnly: true,
          status: 'verified',
          statusNote: 'UN Environment Programme Official Date',
          sourceName: 'UNEP World Environment Day',
          sourceUrl: 'https://www.worldenvironmentday.global',
          visibilityNotes: 'Connect with outdoor nature groups in your community.',
          iconName: 'Leaf',
          locationSpecific: false,
        });
      }

      // October Seasonal & Wildlife
      if (month === 10 && day === 5) {
        events.push({
          id: `wildlife_fall_migration_${dayStr}`,
          title: 'Autumn Avian Migration Window',
          description: 'Peak seasonal window for migratory waterfowl and songbirds journeying south.',
          category: 'wildlife',
          subtype: 'migration',
          dateString: dayStr,
          isDateOnly: true,
          status: 'estimated',
          statusNote: 'Estimated seasonal migration corridor timing',
          sourceName: 'Audubon Bird Migration Network',
          visibilityNotes: 'Look overhead near river corridors and lake habitats.',
          iconName: 'Bird',
          locationSpecific: false,
        });
      }

      if (month === 10 && day === 18) {
        events.push({
          id: `seasonal_autumn_foliage_${dayStr}`,
          title: 'Autumn Foliage Peak Window',
          description: 'Estimated peak brilliant leaf color change across deciduous forest trees.',
          category: 'seasonal',
          subtype: 'foliage',
          dateString: dayStr,
          isDateOnly: true,
          status: 'estimated',
          statusNote: 'Estimated foliage phenology based on regional temperature trends',
          sourceName: 'US Forest Service Foliage Tracker',
          visibilityNotes: 'Great time for forest trail walks and outdoor leaf photography.',
          iconName: 'Trees',
          locationSpecific: false,
        });
      }
    }

    return events;
  }
}

export const defaultSeasonalProvider = new SeasonalNatureProvider();
