import { IRouteProvider, RouteCandidate } from './types';

export class OsrmRouteProvider implements IRouteProvider {
  private baseUrl: string;

  constructor(baseUrl = 'https://router.project-osrm.org/route/v1/foot') {
    this.baseUrl = baseUrl;
  }

  public async getRouteCandidates(
    lat?: number,
    lng?: number,
    targetDistanceKm = 3.0
  ): Promise<RouteCandidate[]> {
    if (lat === undefined || lng === undefined) {
      return this.getLocalFallbackCandidates(targetDistanceKm);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const radiusDeg = (targetDistanceKm / 3.0) * 0.006;
      const wp1 = `${lng},${lat}`;
      const wp2 = `${(lng + radiusDeg).toFixed(6)},${(lat + radiusDeg).toFixed(6)}`;
      const wp3 = `${(lng - radiusDeg).toFixed(6)},${(lat + radiusDeg * 0.8).toFixed(6)}`;
      const waypointsParam = `${wp1};${wp2};${wp3};${wp1}`;

      const url = `${this.baseUrl}/${waypointsParam}?overview=full&geometries=geojson&steps=false`;

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`OSRM routing server returned status ${response.status}. Falling back to local candidates.`);
        return this.getLocalFallbackCandidates(targetDistanceKm);
      }

      const data = await response.json();
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.warn('OSRM routing response code not Ok. Falling back to local candidates.');
        return this.getLocalFallbackCandidates(targetDistanceKm);
      }

      const mainRoute = data.routes[0];
      const rawCoords: Array<[number, number]> = mainRoute.geometry?.coordinates || [];

      if (rawCoords.length < 2) {
        return this.getLocalFallbackCandidates(targetDistanceKm);
      }

      const waypoints = rawCoords.map(([wLng, wLat]) => ({ lat: wLat, lng: wLng }));
      const actualDistanceKm = Math.round((mainRoute.distance / 1000) * 10) / 10;

      const candidates: RouteCandidate[] = [
        {
          id: `osrm_pedestrian_trail_${targetDistanceKm}k`,
          name: `OSRM Pedestrian Trail (${actualDistanceKm} km)`,
          distanceKm: actualDistanceKm,
          surfaceType: 'park_trail',
          natureRating: 'high',
          waypoints,
          attribution: 'Routing by OSRM · Map data © OpenStreetMap contributors',
          isFallback: false,
          providerName: 'OSRM Pedestrian Routing Service',
          description: 'Verified pedestrian footway geometry fetched live from Open Source Routing Machine.',
        },
        ...this.getLocalFallbackCandidates(targetDistanceKm),
      ];

      return candidates;
    } catch (err: any) {
      console.warn('OSRM routing fetch failed or timed out:', err);
      return this.getLocalFallbackCandidates(targetDistanceKm);
    }
  }

  private getLocalFallbackCandidates(targetDistanceKm: number): RouteCandidate[] {
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
        providerName: 'Touch Grass Offline Engine',
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
        providerName: 'Touch Grass Offline Engine',
        description: 'Focus purely on time outdoors rather than distance. Run gently for as long as feels good to your body.',
      },
    ];
  }
}

export const defaultOsrmRouteProvider = new OsrmRouteProvider();
