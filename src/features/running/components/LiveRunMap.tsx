import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MapPin, Navigation, Compass, AlertCircle, RefreshCw, Layers, Play, Maximize2 } from 'lucide-react';
import './LiveRunMap.css';

export interface LiveRunMapProps {
  currentPosition?: { lat: number; lng: number } | null;
  accuracyMeters?: number | null;
  pathCoordinates: Array<{ lat: number; lng: number; timestamp?: number }>;
  gpsStatus: 'searching' | 'tracking' | 'warning' | 'paused' | 'offline';
  gpsError?: string | null;
  isSessionActive: boolean;
  onStartRun?: () => void;
  onLocateMe?: () => void;
  className?: string;
}

export const LiveRunMap: React.FC<LiveRunMapProps> = ({
  currentPosition,
  accuracyMeters,
  pathCoordinates,
  gpsStatus,
  gpsError,
  isSessionActive,
  onStartRun,
  onLocateMe,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const casingPolylineRef = useRef<L.Polyline | null>(null);
  const corePolylineRef = useRef<L.Polyline | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);

  const [tileError, setTileError] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const hasCenteredInitiallyRef = useRef<boolean>(false);

  // Initialize Leaflet Map safely (without fake/hardcoded default coordinates)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // In React 18/19 StrictMode, ensure any lingering leaflet container id is cleared
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      // Use real position if already available; otherwise neutral overview (zoom 2)
      const hasRealPos = Boolean(currentPosition && typeof currentPosition.lat === 'number');
      const startLat = hasRealPos ? currentPosition!.lat : 20.0;
      const startLng = hasRealPos ? currentPosition!.lng : 0.0;
      const startZoom = hasRealPos ? 16 : 2;

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: startZoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      });

      tiles.on('tileerror', () => {
        setTileError(true);
      });

      tiles.addTo(map);

      // 1. High-contrast dark casing polyline (underneath)
      const casing = L.polyline([], {
        color: '#052e16',
        weight: 8,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // 2. Bright emerald green runner polyline (on top)
      const core = L.polyline([], {
        color: '#22c55e',
        weight: 5,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      casingPolylineRef.current = casing;
      corePolylineRef.current = core;
      mapInstanceRef.current = map;

      if (hasRealPos) {
        hasCenteredInitiallyRef.current = true;
      }

      // Detect deliberate map dragging to temporarily suspend auto-follow
      map.on('dragstart', () => {
        setIsFollowing(false);
      });

      // Invalidate size once DOM finishes layout
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {
          // ignore
        }
      }, 100);
    } catch (err) {
      console.warn('Leaflet map initialization notice:', err);
    }

    // ResizeObserver for responsive layout updates
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        try {
          mapInstanceRef.current?.invalidateSize();
        } catch (e) {
          // ignore
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
        casingPolylineRef.current = null;
        corePolylineRef.current = null;
        currentMarkerRef.current = null;
        startMarkerRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Runner marker icon
  const createRunnerIcon = useCallback(() => {
    return L.divIcon({
      className: 'live-runner-marker-container',
      html: `
        <div class="runner-pulse-ring"></div>
        <div class="runner-dot-inner" title="Your live location">
          <span class="runner-dot-emoji">🏃</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  // Route start pin icon
  const createStartIcon = useCallback(() => {
    return L.divIcon({
      className: 'live-start-marker-container',
      html: `
        <div class="start-dot-inner" title="Route Start">
          <span class="start-dot-emoji">🏁</span>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }, []);

  // Update Polyline points as GPS samples arrive
  useEffect(() => {
    if (!mapInstanceRef.current || !corePolylineRef.current || !casingPolylineRef.current) return;

    try {
      // Leaflet strictly expects [latitude, longitude]
      const validPoints = pathCoordinates.filter(
        (c) =>
          typeof c.lat === 'number' &&
          !isNaN(c.lat) &&
          typeof c.lng === 'number' &&
          !isNaN(c.lng)
      );

      const latLngs = validPoints.map((c) => [c.lat, c.lng] as [number, number]);

      // Update both polyline layers
      casingPolylineRef.current.setLatLngs(latLngs);
      corePolylineRef.current.setLatLngs(latLngs);

      // Start marker management
      if (validPoints.length > 0) {
        const first = validPoints[0];
        if (!startMarkerRef.current) {
          startMarkerRef.current = L.marker([first.lat, first.lng], {
            icon: createStartIcon(),
          }).addTo(mapInstanceRef.current);
        } else {
          startMarkerRef.current.setLatLng([first.lat, first.lng]);
        }
      } else if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
    } catch (err) {
      console.warn('Error updating route polyline on map:', err);
    }
  }, [pathCoordinates, createStartIcon]);

  // Update Current Position Marker and Handle Auto-Follow
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    try {
      if (
        currentPosition &&
        typeof currentPosition.lat === 'number' &&
        !isNaN(currentPosition.lat) &&
        typeof currentPosition.lng === 'number' &&
        !isNaN(currentPosition.lng)
      ) {
        const { lat, lng } = currentPosition;

        // Create or move runner marker
        if (!currentMarkerRef.current) {
          currentMarkerRef.current = L.marker([lat, lng], {
            icon: createRunnerIcon(),
            zIndexOffset: 1000,
          }).addTo(mapInstanceRef.current);
        } else {
          currentMarkerRef.current.setLatLng([lat, lng]);
        }

        // Center on the first real coordinate received
        if (!hasCenteredInitiallyRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
          hasCenteredInitiallyRef.current = true;
        } else if (isFollowing) {
          // Smoothly pan to the runner's location without resetting the zoom level
          mapInstanceRef.current.panTo([lat, lng], {
            animate: true,
            duration: 0.5,
          });
        }
      } else if (currentMarkerRef.current) {
        currentMarkerRef.current.remove();
        currentMarkerRef.current = null;
      }
    } catch (err) {
      console.warn('Error updating current location marker on map:', err);
    }
  }, [currentPosition, isFollowing, createRunnerIcon]);

  // Re-engage Auto-Follow & Recenter (or toggle off if already following)
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;

    try {
      if (isFollowing) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
        if (currentPosition) {
          mapInstanceRef.current.panTo([currentPosition.lat, currentPosition.lng], {
            animate: true,
            duration: 0.5,
          });
        } else if (pathCoordinates.length >= 2 && corePolylineRef.current) {
          mapInstanceRef.current.fitBounds(corePolylineRef.current.getBounds(), {
            padding: [40, 40],
          });
        }
        mapInstanceRef.current.invalidateSize();
      }
    } catch (err) {
      console.warn('Recenter action notice:', err);
    }
  };

  // Fit Entire Trail
  const handleFitTrail = () => {
    if (!mapInstanceRef.current || !corePolylineRef.current || pathCoordinates.length < 2) return;

    try {
      setIsFollowing(false);
      mapInstanceRef.current.fitBounds(corePolylineRef.current.getBounds(), {
        padding: [40, 40],
      });
    } catch (err) {
      console.warn('Fit trail action notice:', err);
    }
  };

  const hasRealPosition = Boolean(
    currentPosition &&
      typeof currentPosition.lat === 'number' &&
      !isNaN(currentPosition.lat)
  );

  return (
    <PixelCard
      title="Live GPS Trail Map"
      subtitle={
        isSessionActive
          ? 'Tracking live outdoor trail with OpenStreetMap'
          : 'Interactive running companion map'
      }
      className={`live-run-map-card ${className}`}
    >
      <div className="live-run-map-wrapper" data-testid="live-run-map">
        {/* Map Canvas */}
        <div
          ref={mapContainerRef}
          className="live-run-map-canvas"
          aria-label="Interactive OpenStreetMap GPS Trail View"
          role="region"
        />

        {/* GPS Status HUD Overlay */}
        <div className="map-overlay-badge-group">
          {hasRealPosition && gpsStatus === 'tracking' && (
            <span className="map-badge map-badge--tracking font-pixel">
              <Navigation size={13} className="spin-fast" />
              GPS Active
              {accuracyMeters ? ` • ±${Math.round(accuracyMeters)}m` : ''}
              {pathCoordinates.length >= 2 ? ` • ${pathCoordinates.length} pts` : ''}
            </span>
          )}

          {hasRealPosition && gpsStatus === 'warning' && (
            <span className="map-badge map-badge--warning font-pixel">
              <AlertCircle size={13} />
              Approx GPS {accuracyMeters ? `(±${Math.round(accuracyMeters)}m)` : ''}
            </span>
          )}

          {!hasRealPosition && gpsStatus === 'searching' && (
            <span className="map-badge map-badge--searching font-pixel">
              <RefreshCw size={13} className="spin" />
              Acquiring Live GPS...
            </span>
          )}

          {gpsStatus === 'paused' && (
            <span className="map-badge map-badge--paused font-pixel">
              ⏸️ Session Paused
            </span>
          )}

          {gpsStatus === 'offline' && (
            <span className="map-badge map-badge--offline font-pixel">
              <MapPin size={13} />
              {isSessionActive ? 'Timed Mode (No GPS)' : 'GPS Standby'}
            </span>
          )}

          {tileError && (
            <span className="map-badge map-badge--warning font-pixel" title="Tile network failure">
              <Layers size={13} /> Map Offline
            </span>
          )}
        </div>

        {/* Map Controls Overlay (Recenter, Follow, Fit Trail, Start Run) */}
        <div className="map-control-overlay">
          {isSessionActive && pathCoordinates.length >= 2 && (
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={handleFitTrail}
              icon={<Maximize2 size={13} />}
              className="map-fit-btn"
              title="Fit entire recorded trail to screen"
            >
              Fit Trail
            </PixelButton>
          )}

          {hasRealPosition && (
            <PixelButton
              variant={isFollowing ? 'secondary' : 'accent'}
              size="sm"
              onClick={handleRecenter}
              icon={<Compass size={14} />}
              className="map-recenter-btn"
              title={isFollowing ? 'Currently following runner' : 'Click to follow runner'}
            >
              {isFollowing ? 'Following' : 'Follow Me'}
            </PixelButton>
          )}

          {!isSessionActive && onStartRun && (
            <PixelButton
              variant="accent"
              size="sm"
              onClick={onStartRun}
              icon={<Play size={14} />}
              className="map-start-run-btn"
            >
              Start Run
            </PixelButton>
          )}

          {!isSessionActive && onLocateMe && !hasRealPosition && (
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={onLocateMe}
              icon={<MapPin size={14} />}
              className="map-locate-btn"
            >
              Find Location
            </PixelButton>
          )}
        </div>

        {/* Informative Guidance Overlays */}
        {/* 1. Waiting for GPS signal */}
        {!hasRealPosition && pathCoordinates.length === 0 && (
          <div className="map-empty-state-overlay">
            <div className="empty-state-card font-pixel">
              <MapPin size={24} className="empty-icon text-lime" />
              <p className="empty-title">
                {gpsError
                  ? `Location Notice: ${gpsError}`
                  : gpsStatus === 'searching'
                  ? 'Acquiring your live GPS position...'
                  : 'GPS Standby'}
              </p>
              <p className="empty-desc">
                {gpsError
                  ? 'Please ensure browser location permission is granted.'
                  : 'Your real position will appear as a live runner marker on OpenStreetMap.'}
              </p>
            </div>
          </div>
        )}

        {/* 2. Active run waiting for movement to form a 2-point line */}
        {isSessionActive && pathCoordinates.length < 2 && hasRealPosition && (
          <div className="map-waiting-movement-banner font-pixel">
            <span>🏃 Outdoor run active! Move to record your path (line draws with 2+ points).</span>
          </div>
        )}
      </div>

      {/* Footer Details & OpenStreetMap Attribution */}
      <div className="map-footer-row">
        <span className="map-points-count font-pixel">
          Trail Points: <strong>{pathCoordinates.length}</strong>
          {accuracyMeters ? ` • GPS Precision: ±${Math.round(accuracyMeters)}m` : ''}
        </span>
        <span className="map-osm-attribution font-pixel">
          Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
        </span>
      </div>
    </PixelCard>
  );
};
