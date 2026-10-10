import React, { useState } from 'react';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { Target, Footprints, Clock } from 'lucide-react';

interface RunGoalSelectorProps {
  onSelectGoal: (distanceKm?: number, isTimedOnly?: boolean) => void;
  disabled?: boolean;
}

export const RunGoalSelector: React.FC<RunGoalSelectorProps> = ({
  onSelectGoal,
  disabled = false,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'1k' | '3k' | '5k' | 'custom' | 'timed'>('3k');
  const [customKm, setCustomKm] = useState<string>('2.5');

  const handleStart = () => {
    if (selectedGoal === 'timed') {
      onSelectGoal(undefined, true);
    } else if (selectedGoal === 'custom') {
      const parsed = parseFloat(customKm);
      if (!isNaN(parsed) && parsed > 0) {
        onSelectGoal(parsed, false);
      } else {
        onSelectGoal(2.5, false);
      }
    } else {
      const dist = selectedGoal === '1k' ? 1.0 : selectedGoal === '3k' ? 3.0 : 5.0;
      onSelectGoal(dist, false);
    }
  };

  return (
    <PixelCard title="Set Your Outdoor Goal" subtitle="Select a gentle goal for your run or walk" className="goal-selector-card">
      <div className="goal-options-grid">
        <button
          className={`goal-btn ${selectedGoal === '1k' ? 'selected' : ''}`}
          onClick={() => setSelectedGoal('1k')}
          type="button"
          disabled={disabled}
        >
          <Footprints size={20} />
          <span className="goal-title">1 km</span>
          <span className="goal-sub">Gentle Stroll</span>
        </button>

        <button
          className={`goal-btn ${selectedGoal === '3k' ? 'selected' : ''}`}
          onClick={() => setSelectedGoal('3k')}
          type="button"
          disabled={disabled}
        >
          <Target size={20} />
          <span className="goal-title">3 km</span>
          <span className="goal-sub">Forest Run</span>
        </button>

        <button
          className={`goal-btn ${selectedGoal === '5k' ? 'selected' : ''}`}
          onClick={() => setSelectedGoal('5k')}
          type="button"
          disabled={disabled}
        >
          <Target size={20} />
          <span className="goal-title">5 km</span>
          <span className="goal-sub">Trail Explorer</span>
        </button>

        <button
          className={`goal-btn ${selectedGoal === 'timed' ? 'selected' : ''}`}
          onClick={() => setSelectedGoal('timed')}
          type="button"
          disabled={disabled}
        >
          <Clock size={20} />
          <span className="goal-title">Timed Session</span>
          <span className="goal-sub">No GPS Distance</span>
        </button>
      </div>

      {selectedGoal === 'custom' && (
        <div className="custom-goal-input-group">
          <label htmlFor="custom-dist-input" className="form-label">
            Custom Distance (km):
          </label>
          <input
            id="custom-dist-input"
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={customKm}
            onChange={(e) => setCustomKm(e.target.value)}
            className="pixel-input"
            disabled={disabled}
          />
        </div>
      )}

      <div className="goal-start-row">
        <PixelButton
          variant="accent"
          size="lg"
          onClick={handleStart}
          disabled={disabled}
          icon={<Footprints size={20} />}
        >
          Start Outdoor Session
        </PixelButton>
      </div>
    </PixelCard>
  );
};
