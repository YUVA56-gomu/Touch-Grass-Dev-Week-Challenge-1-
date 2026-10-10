import React, { useState } from 'react';
import { IRouteProvider, RouteCandidate, IGpsLocationProvider, GpsPositionSample } from '../../../services/running/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MapPin, Compass, ShieldAlert, Trees, RefreshCw } from 'lucide-react';

interface RouteDiscoveryPanelProps {
  routeProvider: IRouteProvider;
  gpsProvider: IGpsLocationProvider;
}

export const RouteDiscoveryPanel: React.FC<RouteDiscoveryPanelProps> = ({
  routeProvider,
  gpsProvider,
}) => {
  const [targetDistance, setTargetDistance] = useState<number>(3.0);
  const [routes, setRoutes] = useState<RouteCandidate[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDiscover = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    let lat: number | undefined = undefined;
    let lng: number | undefined = undefined;

    if (gpsProvider.isSupported()) {
      await new Promise<void>((resolve) => {
        gpsProvider.startTracking(
          (sample: GpsPositionSample) => {
            lat = sample.lat;
            lng = sample.lng;
            gpsProvider.stopTracking();
            resolve();
          },
          () => {
            // Permission denied or unavailable; proceed with fallback coordinates
            gpsProvider.stopTracking();
            resolve();
          }
        );

        // Timeout fallback after 4 seconds
        setTimeout(() => {
          gpsProvider.stopTracking();
          resolve();
        }, 4000);
      });
    }

    try {
      const candidates = await routeProvider.getRouteCandidates(lat, lng, targetDistance);
      setRoutes(candidates);
    } catch (err: any) {
      setErrorMsg('Could not fetch trail routes. Showing familiar-ground fallback options.');
      const fallback = await routeProvider.getRouteCandidates(undefined, undefined, targetDistance);
      setRoutes(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PixelCard
      title="Nature Route Discovery"
      subtitle="Find gentle trail loop candidates near your location"
      className="route-discovery-card"
    >
      <div className="route-controls-row">
        <div className="distance-filter">
          <label htmlFor="dist-filter" className="filter-label">
            Target Loop:
          </label>
          <select
            id="dist-filter"
            value={targetDistance}
            onChange={(e) => setTargetDistance(parseFloat(e.target.value))}
            className="pixel-select"
          >
            <option value="1.0">1.0 km</option>
            <option value="3.0">3.0 km</option>
            <option value="5.0">5.0 km</option>
          </select>
        </div>

        <PixelButton
          variant="secondary"
          onClick={handleDiscover}
          disabled={isLoading}
          icon={isLoading ? <RefreshCw size={16} className="spin" /> : <Compass size={16} />}
        >
          {isLoading ? 'Discovering Trails...' : 'Find Nearby Trails'}
        </PixelButton>
      </div>

      {errorMsg && (
        <div className="form-error-alert" style={{ marginTop: '0.75rem' }}>
          <ShieldAlert size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Routes List */}
      {routes && (
        <div className="routes-candidate-list">
          {routes.map((route) => (
            <div key={route.id} className={`route-candidate-item ${route.isFallback ? 'fallback' : ''}`}>
              <div className="route-item-header">
                <div className="route-name-group">
                  <Trees size={18} className="route-icon" />
                  <span className="route-name">{route.name}</span>
                </div>
                <span className="route-distance-badge">{route.distanceKm} km</span>
              </div>

              {route.description && <p className="route-description">{route.description}</p>}

              <div className="route-footer">
                <span className="route-surface-tag">
                  Surface: {route.surfaceType.replace('_', ' ')}
                </span>
                {route.attribution && (
                  <span className="route-attribution">{route.attribution}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Notice */}
      <div className="safety-disclaimer">
        <MapPin size={14} />
        <span>Trail conditions vary by weather. Always watch your step and obey local park rules.</span>
      </div>
    </PixelCard>
  );
};
