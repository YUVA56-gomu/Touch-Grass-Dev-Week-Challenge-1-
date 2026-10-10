import React from 'react';
import './NatureBackground.css';

export const NatureBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="nature-bg">
      {/* Sunlight Rays Overlay */}
      <div className="nature-bg__sunbeams" aria-hidden="true">
        <div className="sunbeam beam-1"></div>
        <div className="sunbeam beam-2"></div>
        <div className="sunbeam beam-3"></div>
      </div>

      {/* Floating Pixel Particles / Leaves */}
      <div className="nature-bg__particles" aria-hidden="true">
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>
        <div className="leaf leaf-3"></div>
        <div className="sprout sprout-1"></div>
        <div className="sprout sprout-2"></div>
      </div>

      {/* Content Container */}
      <div className="nature-bg__content">{children}</div>

      {/* Forest Horizon Silhouette Footer */}
      <div className="nature-bg__forest-horizon" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="forest-svg">
          {/* Background Far Trees */}
          <path
            d="M0 120 L0 80 L30 50 L60 80 L90 40 L130 85 L180 30 L220 75 L270 45 L320 90 L380 35 L430 80 L490 25 L540 75 L600 35 L660 80 L720 30 L780 75 L840 40 L900 85 L960 30 L1020 75 L1080 35 L1140 80 L1200 45 L1200 120 Z"
            fill="#174B35"
            opacity="0.85"
          />
          {/* Foreground Crisp Pixel Trees */}
          <path
            d="M0 120 L0 90 L40 60 L80 90 L140 50 L190 95 L250 55 L300 95 L360 45 L420 90 L480 40 L540 85 L610 50 L670 95 L740 45 L800 90 L860 50 L920 95 L990 45 L1050 90 L1120 50 L1170 85 L1200 65 L1200 120 Z"
            fill="#0D2D20"
          />
        </svg>
      </div>
    </div>
  );
};
