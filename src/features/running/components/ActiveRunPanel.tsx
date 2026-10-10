import React, { useState } from 'react';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { Pause, Play, Square, Trash2, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDurationString, formatPaceString, calculatePace } from '../../../services/running/gpsUtils';

interface ActiveRunPanelProps {
  elapsedSeconds: number;
  distanceKm: number;
  isPaused: boolean;
  gpsStatus: 'searching' | 'tracking' | 'warning' | 'paused' | 'offline';
  targetDistanceKm?: number;
  isTimedOnly?: boolean;
  onPauseToggle: () => void;
  onFinishSave: () => void;
  onDiscard: () => void;
}

export const ActiveRunPanel: React.FC<ActiveRunPanelProps> = ({
  elapsedSeconds,
  distanceKm,
  isPaused,
  gpsStatus,
  targetDistanceKm,
  isTimedOnly = false,
  onPauseToggle,
  onFinishSave,
  onDiscard,
}) => {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const calculatedPace = React.useMemo(() => {
    if (isTimedOnly || distanceKm <= 0.05) return null;
    return calculatePace(distanceKm, elapsedSeconds);
  }, [distanceKm, elapsedSeconds, isTimedOnly]);

  const renderGpsStatusBadge = () => {
    switch (gpsStatus) {
      case 'tracking':
        return (
          <span className="gps-status-badge tracking">
            <Navigation size={14} className="pulse" />
            GPS Active (Tracking)
          </span>
        );
      case 'searching':
        return (
          <span className="gps-status-badge searching">
            <Navigation size={14} className="spin" />
            Acquiring GPS Signal...
          </span>
        );
      case 'warning':
        return (
          <span className="gps-status-badge warning">
            <AlertTriangle size={14} />
            Low GPS Precision
          </span>
        );
      case 'paused':
        return (
          <span className="gps-status-badge paused">
            <Pause size={14} />
            Session Paused
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="gps-status-badge offline">
            <ShieldCheck size={14} />
            Timed Session (No GPS)
          </span>
        );
    }
  };

  return (
    <PixelCard className="active-run-card">
      <div className="active-run-header">
        <div className="active-run-title-group">
          <h2 className="active-run-title">
            {isPaused ? 'Session Paused' : 'Active Outdoor Session'}
          </h2>
          {targetDistanceKm && !isTimedOnly && (
            <span className="target-goal-badge">Goal: {targetDistanceKm} km</span>
          )}
        </div>
        {renderGpsStatusBadge()}
      </div>

      {/* Main Metrics HUD */}
      <div className="active-hud-grid">
        <div className="hud-metric">
          <span className="hud-label">Elapsed Time</span>
          <span className="hud-value timer">{formatDurationString(elapsedSeconds)}</span>
        </div>

        <div className="hud-metric">
          <span className="hud-label">Distance</span>
          <span className="hud-value">
            {isTimedOnly ? '--' : `${distanceKm.toFixed(2)}`}
            <span className="hud-unit">{isTimedOnly ? '' : ' km'}</span>
          </span>
        </div>

        <div className="hud-metric">
          <span className="hud-label">Average Pace</span>
          <span className="hud-value pace">{formatPaceString(calculatedPace)}</span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="safety-notice-banner">
        <ShieldCheck size={16} />
        <span>Stay aware of traffic, weather, and surrounding trail conditions.</span>
      </div>

      {/* Controls */}
      <div className="active-controls-row">
        <PixelButton
          variant={isPaused ? 'accent' : 'secondary'}
          onClick={onPauseToggle}
          icon={isPaused ? <Play size={18} /> : <Pause size={18} />}
        >
          {isPaused ? 'Resume Session' : 'Pause'}
        </PixelButton>

        <PixelButton
          variant="primary"
          onClick={onFinishSave}
          icon={<Square size={18} />}
        >
          Finish & Save
        </PixelButton>

        <PixelButton
          variant="ghost"
          onClick={() => setShowDiscardConfirm(true)}
          icon={<Trash2 size={16} />}
        >
          Discard
        </PixelButton>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="modal-backdrop" onClick={() => setShowDiscardConfirm(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <PixelCard title="Discard Current Session?" className="delete-card">
              <div className="delete-warning-content">
                <AlertTriangle size={32} className="warning-icon" />
                <p className="delete-message">
                  Are you sure you want to discard this run? The active session will be permanently erased without saving.
                </p>
              </div>
              <div className="form-actions">
                <PixelButton variant="secondary" onClick={() => setShowDiscardConfirm(false)}>
                  Keep Running
                </PixelButton>
                <PixelButton variant="accent" onClick={onDiscard}>
                  Discard Session
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        </div>
      )}
    </PixelCard>
  );
};
