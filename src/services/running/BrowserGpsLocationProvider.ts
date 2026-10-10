import { IGpsLocationProvider, GpsPositionSample, GpsError } from './types';

export class BrowserGpsLocationProvider implements IGpsLocationProvider {
  private watchId: number | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator;
  }

  public startTracking(
    onSample: (sample: GpsPositionSample) => void,
    onError: (err: GpsError) => void
  ): boolean {
    if (!this.isSupported()) {
      onError({
        code: 'UNSUPPORTED',
        message: 'Browser Geolocation API is not supported in this environment.',
      });
      return false;
    }

    this.stopTracking(); // Ensure any prior watcher is cleared

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const sample: GpsPositionSample = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp || Date.now(),
          };
          onSample(sample);
        },
        (err) => {
          let code: GpsError['code'] = 'UNKNOWN';
          if (err.code === err.PERMISSION_DENIED) code = 'PERMISSION_DENIED';
          else if (err.code === err.POSITION_UNAVAILABLE) code = 'POSITION_UNAVAILABLE';
          else if (err.code === err.TIMEOUT) code = 'TIMEOUT';

          onError({
            code,
            message: err.message || 'Geolocation error occurred.',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        }
      );
      return true;
    } catch (e: any) {
      onError({
        code: 'UNKNOWN',
        message: e.message || 'Failed to start location tracking.',
      });
      return false;
    }
  }

  public stopTracking(): void {
    if (this.watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
      try {
        navigator.geolocation.clearWatch(this.watchId);
      } catch (e) {
        // ignore
      }
      this.watchId = null;
    }
  }
}

export const defaultGpsProvider = new BrowserGpsLocationProvider();
