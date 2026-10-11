import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RunRecord } from '../../../services/storage/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MascotDisplay } from '../../../components/mascot/MascotDisplay';
import {
  Trophy,
  Clock,
  Footprints,
  Gauge,
  Target,
  Navigation,
  ShieldCheck,
  MapPin,
  MapPinOff,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatDurationString, formatPaceString } from '../../../services/running/gpsUtils';
import './PostRunSummary.css';

export interface PostRunSummaryProps {
  run: RunRecord;
  onClose: () => void;
}

export function getSproutMessage(run: RunRecord): string {
  if (run.isRuralFallback || !run.hasGpsData) {
    if (run.durationSeconds < 60) {
      return 'Even a brief moment outside helps ground your thoughts. Proud of you for taking a step!';
    }
    return 'Wonderful mindful movement! Taking time to step away from screens and move freely in nature is true wellness.';
  }

  if (run.distanceKm <= 0.05 || run.durationSeconds < 10) {
    return 'Every great journey begins with a single step! Take a deep breath of fresh air and keep moving forward.';
  }

  if (run.distanceKm < 1.0) {
    return 'Great job exploring outdoors! A brisk walk or light jog under the open sky does wonders for your energy.';
  }

  if (run.distanceKm < 3.0) {
    return 'Fantastic stride! You touched real grass today and soaked up the healing, restorative power of the outdoors.';
  }

  if (run.distanceKm < 5.0) {
    return 'Incredible run! You covered serious ground out there. The trees and trails were cheering for you!';
  }

  return 'Legendary outdoor adventure! You went above and beyond today. Make sure to hydrate, stretch, and rest up!';
}

export const PostRunSummary: React.FC<PostRunSummaryProps> = ({ run, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const sproutMessage = getSproutMessage(run);

  const mascotExpression =
    run.distanceKm >= 3.0 || run.durationSeconds >= 1200
      ? 'excited'
      : run.distanceKm > 0.05 || run.durationSeconds >= 30
      ? 'happy'
      : 'resting';

  const hasRouteCoordinates = Boolean(run.pathCoordinates && run.pathCoordinates.length >= 2);
  const hasSingleCoordinate = Boolean(run.pathCoordinates && run.pathCoordinates.length === 1);

  // Initialize Summary Map when coordinates exist
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!run.pathCoordinates || run.pathCoordinates.length === 0) return;

    // Strict cleanup in React StrictMode
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      const validPoints = run.pathCoordinates.filter(
        (c) =>
          typeof c.lat === 'number' &&
          !isNaN(c.lat) &&
          typeof c.lng === 'number' &&
          !isNaN(c.lng)
      );

      if (validPoints.length === 0) return;

      const initialCenter: [number, number] = [validPoints[0].lat, validPoints[0].lng];

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView(initialCenter, 15);

      mapInstanceRef.current = map;

      // OSM Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      if (validPoints.length >= 2) {
        const latLngs = validPoints.map((c) => [c.lat, c.lng] as [number, number]);

        // Dual-layer high contrast polyline: dark casing + vibrant emerald core
        L.polyline(latLngs, {
          color: '#052e16',
          weight: 7,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(map);

        const coreLine = L.polyline(latLngs, {
          color: '#22c55e',
          weight: 4,
          opacity: 1.0,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(map);

        // Start Flag Icon
        const startIcon = L.divIcon({
          className: 'summary-start-marker',
          html: '<div style="background:#0f172a;border:2px solid #22c55e;border-radius:4px;padding:2px 4px;font-size:12px;box-shadow:2px 2px 0 rgba(0,0,0,0.5)">🏁 Start</div>',
          iconSize: [52, 24],
          iconAnchor: [26, 12],
        });
        L.marker(latLngs[0], { icon: startIcon }).addTo(map);

        // Finish Flag Icon
        const finishIcon = L.divIcon({
          className: 'summary-finish-marker',
          html: '<div style="background:#052e16;border:2px solid #facc15;border-radius:4px;padding:2px 4px;font-size:12px;color:#fef08a;box-shadow:2px 2px 0 rgba(0,0,0,0.5)">🏆 Finish</div>',
          iconSize: [56, 24],
          iconAnchor: [28, 12],
        });
        L.marker(latLngs[latLngs.length - 1], { icon: finishIcon }).addTo(map);

        // Fit map bounds to exact route
        map.fitBounds(coreLine.getBounds(), {
          padding: [35, 35],
          maxZoom: 17,
        });
      } else {
        // Single point
        const singleIcon = L.divIcon({
          className: 'summary-single-marker',
          html: '<div style="background:#15803d;border:2px solid #86efac;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px #22c55e">📍</div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        L.marker([validPoints[0].lat, validPoints[0].lng], { icon: singleIcon }).addTo(map);
      }

      // Invalidate size once DOM paints
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      return () => {
        clearTimeout(timer);
        map.remove();
        mapInstanceRef.current = null;
        if (mapContainerRef.current) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }
      };
    } catch (err) {
      console.warn('PostRunSummary map initialization notice:', err);
    }
  }, [run.pathCoordinates]);

  // Goal evaluation
  const goalAchievementText = run.targetDistanceKm
    ? run.distanceKm >= run.targetDistanceKm
      ? '🎯 Goal Achieved!'
      : `${Math.round((run.distanceKm / run.targetDistanceKm) * 100)}% of ${run.targetDistanceKm} km goal`
    : 'Free Stroll (No Goal Set)';

  return (
    <div className="post-run-summary-container" role="region" aria-label="Post-run summary">
      <PixelCard className="post-run-summary-card">
        {/* Header */}
        <div className="post-run-header">
          <div className="post-run-title-group">
            <Trophy size={32} className="post-run-trophy-icon" />
            <div>
              <h2 className="post-run-title font-pixel">Run Completed!</h2>
              <p className="post-run-subtitle font-pixel">
                <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                {run.dateString} • Session Saved to History
              </p>
            </div>
          </div>
          <div className="post-run-badges">
            <span
              className={`post-run-mode-badge font-pixel ${
                run.hasGpsData ? 'post-run-mode-badge--gps' : 'post-run-mode-badge--timed'
              }`}
            >
              {run.hasGpsData ? (
                <>
                  <Navigation size={13} /> GPS Route Tracked
                </>
              ) : (
                <>
                  <ShieldCheck size={13} /> Timed Session
                </>
              )}
            </span>
          </div>
        </div>

        {/* Sprout's Nature Companion Encouragement */}
        <div className="post-run-sprout-card">
          <MascotDisplay expression={mascotExpression} size="sm" />
          <div className="post-run-sprout-speech font-pixel">
            <div className="post-run-sprout-name">🌿 Sprout says:</div>
            <p className="post-run-sprout-quote">"{sproutMessage}"</p>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="post-run-stats-grid">
          {/* Distance */}
          <div className="post-run-stat-box">
            <div className="post-run-stat-header font-pixel">
              <Footprints size={14} /> Total Distance
            </div>
            <div className="post-run-stat-value font-pixel">
              {run.distanceKm.toFixed(2)} <span style={{ fontSize: '0.85rem' }}>km</span>
            </div>
            <div className="post-run-stat-subtext font-pixel">
              {run.distanceKm > 0 ? 'Measured ground covered' : 'Stationary or timed'}
            </div>
          </div>

          {/* Duration */}
          <div className="post-run-stat-box">
            <div className="post-run-stat-header font-pixel">
              <Clock size={14} /> Total Time
            </div>
            <div className="post-run-stat-value font-pixel">
              {formatDurationString(run.durationSeconds)}
            </div>
            <div className="post-run-stat-subtext font-pixel">Active outdoor movement</div>
          </div>

          {/* Average Pace */}
          <div className="post-run-stat-box">
            <div className="post-run-stat-header font-pixel">
              <Gauge size={14} /> Average Pace
            </div>
            <div className="post-run-stat-value font-pixel">
              {run.avgPaceMinPerKm ? formatPaceString(run.avgPaceMinPerKm) : 'Unavailable'}
            </div>
            <div className="post-run-stat-subtext font-pixel">
              {run.avgPaceMinPerKm
                ? 'Min / kilometer pace'
                : 'Requires ≥ 50m of movement'}
            </div>
          </div>

          {/* Goal Progress */}
          <div className="post-run-stat-box">
            <div className="post-run-stat-header font-pixel">
              <Target size={14} /> Target Goal
            </div>
            <div
              className="post-run-stat-value font-pixel"
              style={{
                fontSize: run.targetDistanceKm ? '1.1rem' : '0.95rem',
                color:
                  run.targetDistanceKm && run.distanceKm >= run.targetDistanceKm
                    ? '#4ade80'
                    : '#f0fdf4',
              }}
            >
              {goalAchievementText}
            </div>
            <div className="post-run-stat-subtext font-pixel">
              {run.targetDistanceKm ? `Target: ${run.targetDistanceKm} km` : 'No distance limit'}
            </div>
          </div>
        </div>

        {/* Recorded Route Map */}
        <div className="post-run-map-section">
          <div className="post-run-map-header font-pixel">
            <span>
              <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
              {hasRouteCoordinates
                ? `Recorded Trail (${run.pathCoordinates?.length} GPS points)`
                : hasSingleCoordinate
                ? 'Starting Location Pin (1 GPS point)'
                : 'Session Location'}
            </span>
            <span>Leaflet • OpenStreetMap</span>
          </div>

          {hasRouteCoordinates || hasSingleCoordinate ? (
            <div
              ref={mapContainerRef}
              className="post-run-map-canvas"
              data-testid="post-run-map"
            />
          ) : (
            <div className="post-run-map-empty font-pixel" data-testid="post-run-map-empty">
              <MapPinOff size={28} style={{ color: '#94a3b8' }} />
              <p>No GPS route recorded for this session.</p>
              <small>
                {run.isRuralFallback
                  ? 'This activity was logged as a timed or indoor session without GPS tracking.'
                  : 'Location coordinates were not available. Your distance and time are preserved.'}
              </small>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="post-run-actions">
          <PixelButton
            variant="secondary"
            size="md"
            onClick={onClose}
            icon={<CheckCircle2 size={16} />}
          >
            Back to Running Companion
          </PixelButton>
          <PixelButton
            variant="primary"
            size="md"
            onClick={onClose}
            icon={<Footprints size={16} />}
          >
            Start Another Run
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};
