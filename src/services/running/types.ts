export interface GpsPositionSample {
  lat: number;
  lng: number;
  accuracy: number; // In meters
  timestamp: number;
}

export type GpsErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface GpsError {
  code: GpsErrorCode;
  message: string;
}

export interface IGpsLocationProvider {
  isSupported(): boolean;
  startTracking(
    onSample: (sample: GpsPositionSample) => void,
    onError: (err: GpsError) => void
  ): boolean;
  stopTracking(): void;
}

export interface RouteCandidate {
  id: string;
  name: string;
  distanceKm: number;
  surfaceType: 'dirt_path' | 'park_trail' | 'paved_sidewalk' | 'mixed';
  natureRating: 'high' | 'medium' | 'moderate';
  waypoints: Array<{ lat: number; lng: number }>;
  attribution?: string;
  isFallback: boolean;
  description?: string;
}

export interface IRouteProvider {
  getRouteCandidates(lat?: number, lng?: number, targetDistanceKm?: number): Promise<RouteCandidate[]>;
}
