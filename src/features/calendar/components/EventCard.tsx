import React from 'react';
import { NatureEvent, EventStatus } from '../../../services/calendar/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { Sparkles, Sun, Moon, Trees, Flower2, Bird, Globe, Bell, BellOff, ExternalLink, Calendar } from 'lucide-react';
import { parseLocalDateString } from '../../../services/storage/streakUtils';

interface EventCardProps {
  event: NatureEvent;
  isReminderSet: boolean;
  onToggleReminder: (eventId: string) => void;
  onSelectEvent: (event: NatureEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isReminderSet,
  onToggleReminder,
  onSelectEvent,
}) => {
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={18} />;
      case 'Sun': return <Sun size={18} />;
      case 'Moon': return <Moon size={18} />;
      case 'Trees': return <Trees size={18} />;
      case 'Flower2': return <Flower2 size={18} />;
      case 'Bird': return <Bird size={18} />;
      case 'Globe': return <Globe size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  const renderStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'verified':
        return <span className="event-status-badge verified">Verified</span>;
      case 'calculated':
        return <span className="event-status-badge calculated">Calculated</span>;
      case 'forecast':
        return <span className="event-status-badge forecast">Forecast</span>;
      case 'estimated':
        return <span className="event-status-badge estimated">Estimated</span>;
      case 'unverified':
      default:
        return <span className="event-status-badge unverified">Unverified</span>;
    }
  };

  const formattedDate = React.useMemo(() => {
    try {
      const d = parseLocalDateString(event.dateString);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return event.dateString;
    }
  }, [event.dateString]);

  return (
    <PixelCard className="nature-event-card" interactive={true} onClick={() => onSelectEvent(event)}>
      <div className="event-card-header">
        <div className="event-title-group">
          <div className="event-icon-box">
            {renderCategoryIcon(event.iconName)}
          </div>
          <div>
            <h3 className="event-card-title">{event.title}</h3>
            <div className="event-date-row">
              <span className="event-date-text">{formattedDate}</span>
              <span className="event-category-tag">{event.category.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="event-header-actions" onClick={(e) => e.stopPropagation()}>
          {renderStatusBadge(event.status)}
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => onToggleReminder(event.id)}
            aria-label={isReminderSet ? `Remove reminder for ${event.title}` : `Set reminder for ${event.title}`}
          >
            {isReminderSet ? <Bell size={16} className="bell-active" /> : <BellOff size={16} />}
          </PixelButton>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-card-footer">
        <span className="event-source">
          Source: {event.sourceName}
        </span>
        {event.sourceUrl && (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} /> Link
          </a>
        )}
      </div>
    </PixelCard>
  );
};
