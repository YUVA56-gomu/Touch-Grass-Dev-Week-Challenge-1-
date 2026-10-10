import React from 'react';
import { ActivitySummary } from '../../../services/storage/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { Compass, Flame, Footprints, Trees, Sun, Award, Calendar, Clock } from 'lucide-react';

interface TrackerStatsHeaderProps {
  summary: ActivitySummary;
}

export const TrackerStatsHeader: React.FC<TrackerStatsHeaderProps> = ({ summary }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints size={18} />;
      case 'Flame': return <Flame size={18} />;
      case 'Compass': return <Compass size={18} />;
      case 'Trees': return <Trees size={18} />;
      case 'Sun': return <Sun size={18} />;
      default: return <Award size={18} />;
    }
  };

  return (
    <div className="tracker-stats-container">
      {/* Primary Metrics Grid */}
      <div className="tracker-metrics-grid">
        <PixelCard className="stat-metric-card">
          <div className="metric-header">
            <Flame className="metric-icon flame-icon" size={22} />
            <span className="metric-label">Current Streak</span>
          </div>
          <div className="metric-value">{summary.currentStreak} <span className="metric-unit">days</span></div>
          <div className="metric-subtext">Longest: {summary.longestStreak} days</div>
        </PixelCard>

        <PixelCard className="stat-metric-card">
          <div className="metric-header">
            <Calendar className="metric-icon calendar-icon" size={22} />
            <span className="metric-label">Distinct Days</span>
          </div>
          <div className="metric-value">{summary.distinctOutdoorDays} <span className="metric-unit">days</span></div>
          <div className="metric-subtext">Total visits: {summary.totalVisits}</div>
        </PixelCard>

        <PixelCard className="stat-metric-card">
          <div className="metric-header">
            <Clock className="metric-icon clock-icon" size={22} />
            <span className="metric-label">Time Outdoors</span>
          </div>
          <div className="metric-value">
            {summary.totalDurationMinutes >= 60
              ? `${(summary.totalDurationMinutes / 60).toFixed(1)} hrs`
              : `${summary.totalDurationMinutes} mins`}
          </div>
          <div className="metric-subtext">Logged reflections</div>
        </PixelCard>
      </div>

      {/* Spirit Badges / Achievements */}
      <PixelCard title="Spirit Badges & Milestones" subtitle="Celebrate your outdoor journey" className="achievements-card">
        <div className="achievements-list">
          {summary.achievements.map((badge) => (
            <div
              key={badge.id}
              className={`achievement-badge ${badge.unlocked ? 'unlocked' : 'locked'}`}
              title={badge.description}
            >
              <div className="badge-icon-box">
                {renderIcon(badge.iconName)}
              </div>
              <div className="badge-info">
                <span className="badge-title">{badge.title}</span>
                <span className="badge-progress">
                  {badge.unlocked ? 'Unlocked! ✨' : `${badge.progress} / ${badge.target}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PixelCard>
    </div>
  );
};
