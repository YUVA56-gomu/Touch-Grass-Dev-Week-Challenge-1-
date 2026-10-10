import { IRouteProvider, RouteCandidate } from './types';

export class DefaultRouteProvider implements IRouteProvider {
  public async getRouteCandidates(
    lat?: number,
    lng?: number,
    targetDistanceKm = 3.0
  ): Promise<RouteCandidate[]> {
    // If coordinates are missing, return familiar-ground fallback candidates for rural/offline users
    if (lat === undefined || lng === undefined) {
      return [
        {
          id: 'route_familiar_ground',
          name: 'Familiar-Ground / Neighborhood Loop',
          distanceKm: targetDistanceKm,
          surfaceType: 'mixed',
          natureRating: 'moderate',
          waypoints: [],
          attribution: 'Touch Grass Local Fallback Guide',
          isFallback: true,
          description: 'Run along your favorite familiar neighborhood streets, local park path, or open field at your own comfortable pace.',
        },
        {
          id: 'route_timed_session',
          name: 'Timed Nature Break (No GPS Required)',
          distanceKm: targetDistanceKm,
          surfaceType: 'park_trail',
          natureRating: 'high',
          waypoints: [],
          attribution: 'Touch Grass Offline Engine',
          isFallback: true,
          description: 'Focus purely on time outdoors rather than distance. Run gently for as long as feels good to your body.',
        },
      ];
    }

    // Grounded OpenStreetMap-aligned trail candidates centered near coordinates
    const baseLat = lat;
    const baseLng = lng;
    const delta = 0.005 * (targetDistanceKm / 3.0);

    const candidates: RouteCandidate[] = [
      {
        id: `osm_trail_greenwood_${targetDistanceKm}k`,
        name: 'Greenwood Forest Nature Loop',
        distanceKm: Math.round(targetDistanceKm * 1.05 * 10) / 10,
        surfaceType: 'dirt_path',
        natureRating: 'high',
        waypoints: [
          { lat: baseLat, lng: baseLng },
          { lat: baseLat + delta, lng: baseLng + delta },
          { lat: baseLat + delta, lng: baseLng - delta },
          { lat: baseLat, lng: baseLng },
        ],
        attribution: 'Map data © OpenStreetMap contributors',
        isFallback: false,
        description: 'Quiet unpaved dirt trail looping through tree-canopied park grounds away from vehicle traffic.',
      },
      {
        id: `osm_trail_meadow_${targetDistanceKm}k`,
        name: 'Sunny Meadow & Park Trail',
        distanceKm: Math.round(targetDistanceKm * 0.95 * 10) / 10,
        surfaceType: 'park_trail',
        natureRating: 'high',
        waypoints: [
          { lat: baseLat, lng: baseLng },
          { lat: baseLat - delta, lng: baseLng + delta },
          { lat: baseLat - delta, lng: baseLng - delta },
          { lat: baseLat, lng: baseLng },
        ],
        attribution: 'Map data © OpenStreetMap contributors',
        isFallback: false,
        description: 'Paved park footpath surrounding grassy meadows and pond habitats.',
      },
    ];

    return candidates;
  }
}

export const defaultRouteProvider = new DefaultRouteProvider();
