import { GpsPositionSample } from './types';

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates the great-circle distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if (lat1 === lat2 && lng1 === lng2) {
    return 0;
  }

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 1000) / 1000; // Round to 3 decimal places (meters precision)
}

/**
 * Validates and filters GPS samples to reject low-accuracy readings, duplicates, and speed jumps.
 */
export function filterGpsSample(
  newSample: GpsPositionSample,
  prevSample?: GpsPositionSample,
  maxAccuracyMeters = 50,
  maxSpeedKmH = 30
): boolean {
  // Reject low-accuracy readings
  if (typeof newSample.accuracy === 'number' && newSample.accuracy > maxAccuracyMeters) {
    return false;
  }

  if (!prevSample) {
    return true;
  }

  // Reject out-of-order or duplicate timestamps
  if (newSample.timestamp <= prevSample.timestamp) {
    return false;
  }

  // Reject identical coordinate duplicate points
  if (newSample.lat === prevSample.lat && newSample.lng === prevSample.lng) {
    return false;
  }

  // Calculate speed between samples
  const distanceKm = calculateHaversineDistance(
    prevSample.lat,
    prevSample.lng,
    newSample.lat,
    newSample.lng
  );

  const timeHours = (newSample.timestamp - prevSample.timestamp) / (1000 * 60 * 60);

  if (timeHours <= 0) {
    return false;
  }

  const speedKmH = distanceKm / timeHours;

  // Reject implausible pedestrian speed jumps (e.g. > 30 km/h)
  if (speedKmH > maxSpeedKmH) {
    return false;
  }

  return true;
}

/**
 * Computes average pace in minutes per kilometer. Returns null if data is insufficient or implausible.
 */
export function calculatePace(distanceKm: number, durationSeconds: number): number | null {
  if (distanceKm <= 0.05 || durationSeconds < 5) {
    return null;
  }

  const durationMinutes = durationSeconds / 60;
  const pace = durationMinutes / distanceKm;

  if (pace < 1.5 || pace > 60) {
    return null;
  }

  return Math.round(pace * 100) / 100;
}

/**
 * Formats pace float into readable string (e.g. 5.5 -> "5'30\" /km")
 */
export function formatPaceString(paceMinPerKm: number | null | undefined): string {
  if (paceMinPerKm === null || paceMinPerKm === undefined || isNaN(paceMinPerKm)) {
    return '--:--';
  }

  const mins = Math.floor(paceMinPerKm);
  const secs = Math.round((paceMinPerKm - mins) * 60);
  const secsPadded = String(secs).padStart(2, '0');

  return `${mins}'${secsPadded}" /km`;
}

/**
 * Formats duration in seconds to mm:ss or hh:mm:ss
 */
export function formatDurationString(durationSeconds: number): string {
  const hrs = Math.floor(durationSeconds / 3600);
  const mins = Math.floor((durationSeconds % 3600) / 60);
  const secs = Math.floor(durationSeconds % 60);

  const minsStr = String(mins).padStart(2, '0');
  const secsStr = String(secs).padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${minsStr}:${secsStr}`;
  }

  return `${minsStr}:${secsStr}`;
}
