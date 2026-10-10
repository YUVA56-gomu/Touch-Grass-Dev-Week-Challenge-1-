import React from 'react';
import { DaylightTimes, MoonPhaseInfo } from '../../../services/calendar/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { Sun, Moon, Sunrise, Sunset, Clock, MapPin, Compass } from 'lucide-react';

interface DaylightBannerProps {
  daylight: DaylightTimes;
  moon: MoonPhaseInfo;
  isCustomLocation: boolean;
  onRequestLocation: () => void;
  isLoadingLocation: boolean;
}

export const DaylightBanner: React.FC<DaylightBannerProps> = ({
  daylight,
  moon,
  isCustomLocation,
  onRequestLocation,
  isLoadingLocation,
}) => {
  return (
    <PixelCard className="daylight-banner-card">
      <div className="banner-top-row">
        <div className="banner-title-group">
          <h2 className="banner-title">
            <Sun size={24} className="sun-pulse-icon" />
            Today's Sky & Rhythms
          </h2>
          <span className="banner-date">{daylight.dateString}</span>
        </div>

        <div className="location-status-group">
          <span className={`location-pill ${isCustomLocation ? 'custom' : 'default'}`}>
            <MapPin size={14} />
            {isCustomLocation ? 'Device GPS Location' : 'Regional Default Location'}
          </span>
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={onRequestLocation}
            disabled={isLoadingLocation}
            icon={<Compass size={15} />}
          >
            {isLoadingLocation ? 'Locating...' : 'Use My Location'}
          </PixelButton>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="sky-metrics-grid">
        <div className="sky-metric-item">
          <Sunrise size={20} className="sky-icon sunrise-icon" />
          <div className="sky-info">
            <span className="sky-label">Sunrise</span>
            <span className="sky-val">{daylight.sunrise} AM</span>
          </div>
        </div>

        <div className="sky-metric-item">
          <Sunset size={20} className="sky-icon sunset-icon" />
          <div className="sky-info">
            <span className="sky-label">Sunset</span>
            <span className="sky-val">{daylight.sunset} PM</span>
          </div>
        </div>

        <div className="sky-metric-item">
          <Clock size={20} className="sky-icon clock-icon" />
          <div className="sky-info">
            <span className="sky-label">Daylight Length</span>
            <span className="sky-val">
              {Math.floor(daylight.dayLengthMinutes / 60)}h {daylight.dayLengthMinutes % 60}m
            </span>
          </div>
        </div>

        <div className="sky-metric-item">
          <Moon size={20} className="sky-icon moon-icon" />
          <div className="sky-info">
            <span className="sky-label">Moon Phase</span>
            <span className="sky-val">
              {moon.phaseName} ({moon.illuminationPercent}%)
            </span>
          </div>
        </div>
      </div>

      <div className="golden-hour-subtext">
        <Sun size={14} />
        <span>Golden Hours: Morning ({daylight.goldenHourMorning}) · Evening ({daylight.goldenHourEvening})</span>
      </div>
    </PixelCard>
  );
};
