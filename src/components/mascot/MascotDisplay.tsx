import React from 'react';
import { MascotProps } from '../../types';
import './MascotDisplay.css';

export const MascotDisplay: React.FC<MascotProps> = ({
  expression = 'happy',
  size = 'md',
  showSpeechBubble = false,
  message = "Hello! I'm your Nature Friend. Ready to touch some grass today?",
  className = '',
}) => {
  const sizeMap = {
    sm: 80,
    md: 140,
    lg: 200,
    xl: 260,
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`mascot-container mascot-container--${size} ${className}`}>
      {showSpeechBubble && message && (
        <div className="mascot-speech-bubble font-pixel">
          <p>{message}</p>
          <div className="mascot-speech-bubble__arrow"></div>
        </div>
      )}

      <div className="mascot-sprite-wrapper animate-float">
        <svg
          width={currentSize}
          height={currentSize}
          viewBox="0 0 100 100"
          className="mascot-svg"
          shapeRendering="crispEdges"
          aria-label={`Nature mascot spirit (${expression} expression)`}
          role="img"
        >
          {/* Subtle Outer Glow */}
          <ellipse cx="50" cy="55" rx="35" ry="32" fill="#C8F36A" opacity="0.15" className="animate-pulse-glow" />

          {/* Shadow beneath mascot */}
          <ellipse cx="50" cy="90" rx="24" ry="5" fill="#0A241A" opacity="0.6" />

          {/* Leaf Crown / Sprout */}
          <path d="M48 6 H52 V16 H48 Z" fill="#76CF45" />
          <path d="M52 10 H60 V14 H52 Z" fill="#76CF45" />
          <path d="M40 12 H48 V16 H40 Z" fill="#23834F" />

          {/* Mascot Body - Teardrop Nature Spirit Outer Outline */}
          <path
            d="
              M45 14 H55 V18 H63 V24 H69 V32 H74 V42 H78 V54 H80 V68 H76 V80 H68 V86 H58 V88 H42 V86 H32 V80 H24 V68 H20 V54 H22 V42 H26 V32 H31 V24 H37 V18 H45 Z
            "
            fill="#174B35"
          />

          {/* Lime Green Body Fill */}
          <path
            d="
              M47 18 H53 V22 H61 V28 H67 V36 H72 V46 H74 V66 H72 V76 H64 V82 H54 V84 H46 V82 H36 V76 H28 V66 H26 V46 H28 V36 H33 V28 H39 V22 H47 Z
            "
            fill="#C8F36A"
          />

          {/* Body Shading / Highlight Gradient */}
          <path d="M33 28 H39 V36 H33 Z M28 36 H33 V46 H28 Z M26 46 H28 V60 H26 Z" fill="#E2FA98" />
          <path d="M64 76 H72 V66 H64 Z M54 82 H64 V76 H54 Z M36 76 H46 V82 H36 Z" fill="#A8DF45" opacity="0.7" />

          {/* Rosy Cheeks */}
          <rect x="30" y="58" width="10" height="6" fill="#F8A5C2" rx="1" />
          <rect x="60" y="58" width="10" height="6" fill="#F8A5C2" rx="1" />

          {/* Eyes depending on expression */}
          {expression === 'happy' || expression === 'waving' ? (
            <>
              {/* Happy Sparkle Eyes */}
              <rect x="36" y="46" width="7" height="9" fill="#174B35" />
              <rect x="57" y="46" width="7" height="9" fill="#174B35" />
              <rect x="37" y="47" width="3" height="3" fill="#FFFFFF" />
              <rect x="58" y="47" width="3" height="3" fill="#FFFFFF" />
            </>
          ) : expression === 'excited' ? (
            <>
              {/* Starry Eyes */}
              <path d="M36 48 H43 V53 H36 Z" fill="#174B35" />
              <path d="M57 48 H64 V53 H57 Z" fill="#174B35" />
              <rect x="38" y="46" width="3" height="7" fill="#F5D66C" />
              <rect x="59" y="46" width="3" height="7" fill="#F5D66C" />
            </>
          ) : expression === 'thinking' ? (
            <>
              {/* Looking up right */}
              <rect x="37" y="45" width="7" height="8" fill="#174B35" />
              <rect x="58" y="45" width="7" height="8" fill="#174B35" />
              <rect x="40" y="45" width="3" height="3" fill="#FFFFFF" />
              <rect x="61" y="45" width="3" height="3" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Peaceful Curved Eyes */}
              <path d="M35 50 Q39 44 43 50" stroke="#174B35" strokeWidth="3" fill="none" />
              <path d="M57 50 Q61 44 65 50" stroke="#174B35" strokeWidth="3" fill="none" />
            </>
          )}

          {/* Mouth */}
          {expression === 'excited' ? (
            <path d="M44 62 Q50 72 56 62 Z" fill="#174B35" />
          ) : expression === 'thinking' ? (
            <rect x="46" y="64" width="8" height="3" fill="#174B35" />
          ) : (
            <path d="M44 62 Q50 68 56 62" stroke="#174B35" strokeWidth="3" fill="none" />
          )}

          {/* Waving Arm */}
          {expression === 'waving' && (
            <g className="mascot-waving-arm">
              <path d="M72 50 H84 V56 H72 Z" fill="#C8F36A" stroke="#174B35" strokeWidth="2" />
              <path d="M84 44 H90 V52 H84 Z" fill="#C8F36A" stroke="#174B35" strokeWidth="2" />
            </g>
          )}

          {/* Nature Sparkles */}
          <rect x="14" y="24" width="3" height="3" fill="#F5D66C" className="animate-pulse-glow" />
          <rect x="80" y="30" width="3" height="3" fill="#F5D66C" className="animate-pulse-glow" />
          <rect x="76" y="74" width="4" height="4" fill="#76CF45" />
        </svg>
      </div>
    </div>
  );
};
