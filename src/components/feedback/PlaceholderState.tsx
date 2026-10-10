import React from 'react';
import { PixelCard } from '../pixel-ui/PixelCard';
import { PixelButton } from '../pixel-ui/PixelButton';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './PlaceholderState.css';

interface PlaceholderStateProps {
  title: string;
  badge?: string;
  description: string;
  featuresList: string[];
  icon: React.ReactNode;
  actionText?: string;
  actionPath?: string;
}

export const PlaceholderState: React.FC<PlaceholderStateProps> = ({
  title,
  badge = 'Coming Soon in Milestone 2',
  description,
  featuresList,
  icon,
  actionText = 'Back to Home',
  actionPath = '/',
}) => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-wrapper">
      <PixelCard
        title={title}
        badge={badge}
        icon={icon}
        className="placeholder-card"
      >
        <div className="placeholder-content">
          <p className="placeholder-description">{description}</p>

          <div className="placeholder-features">
            <h4 className="placeholder-features__title font-pixel">
              <Sparkles size={18} /> What you will find here:
            </h4>
            <ul className="placeholder-features__list">
              {featuresList.map((feat, index) => (
                <li key={index} className="placeholder-features__item">
                  <span className="bullet font-pixel">✦</span> {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="placeholder-notice">
            <p className="font-pixel">
              🌱 This section is currently in initial foundation state. No fake data or mock GPS is being displayed.
            </p>
          </div>

          {actionText && (
            <div className="placeholder-action">
              <PixelButton
                variant="primary"
                onClick={() => navigate(actionPath)}
              >
                {actionText}
              </PixelButton>
            </div>
          )}
        </div>
      </PixelCard>
    </div>
  );
};
