import React from 'react';
import { PlaceholderState } from '../components/feedback/PlaceholderState';
import { Compass } from 'lucide-react';

export const TrackerPage: React.FC = () => {
  return (
    <div className="tracker-page">
      <PlaceholderState
        title="Touch Grass Tracker"
        badge="Section 02 · Outdoor Habit Journal"
        icon={<Compass size={24} />}
        description="The Touch Grass Tracker will empower you to log every time you step outside, take a walk in the park, sit under a tree, or visit a nearby nature trail."
        featuresList={[
          "Log outdoor visits with duration, location notes, and mood reflections",
          "Capture and store memory photos in a personal 16-bit nature gallery",
          "Track consecutive outdoor streak days and unlock nature spirit badges",
          "IndexedDB local-first storage to keep your private memories safe on your device"
        ]}
        actionText="Back to AI Friend"
        actionPath="/"
      />
    </div>
  );
};
