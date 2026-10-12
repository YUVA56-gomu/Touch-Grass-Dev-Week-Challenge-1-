import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { MascotDisplay } from '../../../components/mascot/MascotDisplay';
import { getNextSproutMessage } from '../data/sproutEntranceMessages';
import './MeetSproutEntrance.css';

export interface MeetSproutEntranceProps {
  isOpen: boolean;
  onClose: () => void;
  autoContinueDurationMs?: number; // default: 2800ms (paced, relaxed entrance)
  initialMessage?: string; // optional override for testing
}

export const MeetSproutEntrance: React.FC<MeetSproutEntranceProps> = ({
  isOpen,
  onClose,
  autoContinueDurationMs = 2800,
  initialMessage,
}) => {
  const navigate = useNavigate();
  const titleId = useId();

  // Curated random message selection (non-repeating consecutively)
  const [greetingMessage] = useState<string>(() => initialMessage || getNextSproutMessage());

  // Timers and navigation safety guards
  const hasNavigatedRef = useRef<boolean>(false);
  const autoContinueTimerRef = useRef<number | null>(null);

  // Navigate to /friend safely without duplicates
  const handleProceed = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // Clear all pending timers
    if (autoContinueTimerRef.current !== null) {
      window.clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }

    onClose();
    navigate('/friend');
  };

  // Close/cancel modal without navigating
  const handleCancel = () => {
    if (autoContinueTimerRef.current !== null) {
      window.clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    onClose();
  };

  // Auto-continue transition timer & keyboard listeners
  useEffect(() => {
    if (!isOpen) return;

    // Auto-continue timer once sweep transition and greeting presentation complete (default: 2800ms)
    autoContinueTimerRef.current = window.setTimeout(() => {
      handleProceed();
    }, autoContinueDurationMs);

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (autoContinueTimerRef.current !== null) {
        window.clearTimeout(autoContinueTimerRef.current);
        autoContinueTimerRef.current = null;
      }
    };
  }, [isOpen, autoContinueDurationMs]);

  if (!isOpen) return null;

  return (
    <div
      className="sprout-entrance-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* White Magical Transition Overlay: clean diagonal white slash sweeping across viewport with subtle soft glow and pixel particles */}
      <div className="magical-slash-overlay" aria-hidden="true" data-testid="magical-slash-overlay">
        <div className="magical-slash-beam" />
        <div className="magical-slash-glow" />
        <div className="magical-particles">
          <span className="magical-particle particle--1" />
          <span className="magical-particle particle--2" />
          <span className="magical-particle particle--3" />
          <span className="magical-particle particle--4" />
        </div>
      </div>

      <div className="sprout-entrance-card">
        {/* Floating background pixel leaves */}
        <div className="entrance-leaves-layer" aria-hidden="true">
          <div className="pixel-leaf pixel-leaf--1" />
          <div className="pixel-leaf pixel-leaf--2" />
          <div className="pixel-leaf pixel-leaf--3" />
          <div className="pixel-leaf pixel-leaf--4" />
        </div>

        {/* Close button */}
        <button
          className="entrance-close-btn"
          onClick={handleCancel}
          aria-label="Close"
          id="entrance-close-btn"
          type="button"
        >
          <X size={18} />
        </button>

        {/* Mascot Stage with Soft Glow and Floating Bob */}
        <div className="entrance-mascot-stage">
          <div className="sprout-radiant-glow" aria-hidden="true" />
          <div className="entrance-mascot-wrapper">
            <MascotDisplay
              expression="excited"
              size="md"
              showSpeechBubble={false}
            />
          </div>
        </div>

        {/* Motivational Greeting Bubble — Static Text immediately (NO typewriter effect) */}
        <div className="entrance-speech-bubble" aria-live="polite">
          <div className="entrance-speech-arrow" aria-hidden="true" />
          <p id={titleId} className="entrance-message-text font-pixel">
            {greetingMessage}
          </p>
        </div>

        {/* Actions: Let's Go & Skip — Navigates immediately */}
        <div className="entrance-actions">
          <button
            type="button"
            className="entrance-btn-primary font-pixel"
            onClick={handleProceed}
            id="entrance-lets-go-btn"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>Let's go!</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="entrance-btn-skip font-pixel"
            onClick={handleProceed}
            id="entrance-skip-btn"
          >
            Skip
          </button>
        </div>

        {/* Auto-continue Progress indicator */}
        <div
          className="entrance-progress-bar"
          aria-hidden="true"
          title="Continuing automatically..."
        >
          <div
            className="entrance-progress-fill"
            style={{ animationDuration: `${autoContinueDurationMs}ms` }}
          />
        </div>
      </div>
    </div>
  );
};
