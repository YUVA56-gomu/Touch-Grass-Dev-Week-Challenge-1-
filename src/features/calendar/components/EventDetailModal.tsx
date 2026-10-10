import React from 'react';
import { NatureEvent } from '../../../services/calendar/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { X, Calendar, Info, ExternalLink, Bell, BellOff, MapPin, Eye } from 'lucide-react';

interface EventDetailModalProps {
  isOpen: boolean;
  event: NatureEvent | null;
  isReminderSet: boolean;
  onClose: () => void;
  onToggleReminder: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  isReminderSet,
  onClose,
  onToggleReminder,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="event-detail-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <PixelCard title={event.title} className="event-detail-card">
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>

          <div className="event-detail-body">
            <div className="detail-meta-row">
              <div className="detail-meta-item">
                <Calendar size={16} />
                <span>{event.dateString}</span>
              </div>
              <span className={`event-status-badge ${event.status}`}>
                Status: {event.status.toUpperCase()}
              </span>
            </div>

            {event.statusNote && (
              <div className="status-note-banner">
                <Info size={16} />
                <span>{event.statusNote}</span>
              </div>
            )}

            <p className="detail-description">{event.description}</p>

            {event.visibilityNotes && (
              <div className="visibility-notes-box">
                <div className="visibility-header">
                  <Eye size={16} />
                  <span>Viewing Guidance:</span>
                </div>
                <p className="visibility-text">{event.visibilityNotes}</p>
              </div>
            )}

            <div className="detail-source-row">
              <div className="source-info">
                <span className="source-label">Data Provider:</span>
                <span className="source-name">{event.sourceName}</span>
              </div>
              {event.sourceUrl && (
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-external-link"
                >
                  <ExternalLink size={14} /> Official Reference Page
                </a>
              )}
            </div>

            {event.locationSpecific && (
              <div className="location-specific-notice">
                <MapPin size={14} />
                <span>Location-Specific Event: Visibility depends on local geographic coordinates.</span>
              </div>
            )}

            <div className="form-actions">
              <PixelButton
                variant="secondary"
                onClick={() => onToggleReminder(event.id)}
                icon={isReminderSet ? <BellOff size={16} /> : <Bell size={16} />}
              >
                {isReminderSet ? 'Remove Reminder' : 'Set Local Reminder'}
              </PixelButton>

              <PixelButton variant="primary" onClick={onClose}>
                Close
              </PixelButton>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
