import React from 'react';
import { PixelCardProps } from '../../types';
import './PixelCard.css';

export const PixelCard: React.FC<PixelCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  const cardClasses = [
    'pixel-card',
    interactive || onClick ? 'pixel-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {(title || icon || badge) && (
        <div className="pixel-card__header">
          <div className="pixel-card__title-wrapper">
            {icon && <span className="pixel-card__icon" aria-hidden="true">{icon}</span>}
            <div>
              {title && <h3 className="pixel-card__title">{title}</h3>}
              {subtitle && <p className="pixel-card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {badge && <span className="pixel-card__badge">{badge}</span>}
        </div>
      )}
      <div className="pixel-card__body">{children}</div>
    </div>
  );
};
