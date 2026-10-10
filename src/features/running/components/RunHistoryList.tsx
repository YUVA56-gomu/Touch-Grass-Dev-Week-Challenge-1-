import React, { useState } from 'react';
import { RunRecord } from '../../../services/storage/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { Footprints, Calendar, Clock, Navigation, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDurationString, formatPaceString } from '../../../services/running/gpsUtils';

interface RunHistoryListProps {
  runs: RunRecord[];
  onDeleteRun: (id: string) => Promise<void>;
}

export const RunHistoryList: React.FC<RunHistoryListProps> = ({ runs, onDeleteRun }) => {
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (deletingRunId) {
      await onDeleteRun(deletingRunId);
      setDeletingRunId(null);
    }
  };

  if (runs.length === 0) {
    return (
      <PixelCard className="empty-history-card">
        <Footprints size={40} className="empty-run-icon" />
        <h3 className="empty-title">No Run Records Yet</h3>
        <p className="empty-text">
          Set a goal above and take your first step outdoors! Every stride in nature counts toward feeling refreshed.
        </p>
      </PixelCard>
    );
  }

  return (
    <div className="run-history-container">
      <h3 className="run-history-title">Recent Running & Stroll History</h3>
      <div className="run-history-grid">
        {runs.map((run) => (
          <PixelCard key={run.id} className="run-history-card">
            <div className="run-card-header">
              <div className="run-date">
                <Calendar size={15} />
                <span>{run.dateString}</span>
              </div>
              <div className="run-card-top-actions">
                <span className={`run-mode-badge ${run.hasGpsData ? 'gps' : 'timed'}`}>
                  {run.hasGpsData ? (
                    <>
                      <Navigation size={12} /> GPS Tracked
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={12} /> Timed Session
                    </>
                  )}
                </span>
                <PixelButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingRunId(run.id)}
                  aria-label={`Delete run from ${run.dateString}`}
                >
                  <Trash2 size={14} />
                </PixelButton>
              </div>
            </div>

            <div className="run-metrics-row">
              <div className="run-submetric">
                <span className="submetric-label">Distance</span>
                <span className="submetric-val">
                  {run.hasGpsData ? `${run.distanceKm.toFixed(2)} km` : 'Timed'}
                </span>
              </div>

              <div className="run-submetric">
                <span className="submetric-label">Duration</span>
                <span className="submetric-val">
                  <Clock size={13} /> {formatDurationString(run.durationSeconds)}
                </span>
              </div>

              <div className="run-submetric">
                <span className="submetric-label">Avg Pace</span>
                <span className="submetric-val">
                  {formatPaceString(run.avgPaceMinPerKm)}
                </span>
              </div>
            </div>
          </PixelCard>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingRunId && (
        <div className="modal-backdrop" onClick={() => setDeletingRunId(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <PixelCard title="Delete Run Record?" className="delete-card">
              <div className="delete-warning-content">
                <AlertTriangle size={32} className="warning-icon" />
                <p className="delete-message">
                  Are you sure you want to delete this completed run record?
                </p>
              </div>
              <div className="form-actions">
                <PixelButton variant="secondary" onClick={() => setDeletingRunId(null)}>
                  Cancel
                </PixelButton>
                <PixelButton variant="accent" onClick={handleDeleteConfirm}>
                  Yes, Delete Record
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        </div>
      )}
    </div>
  );
};
