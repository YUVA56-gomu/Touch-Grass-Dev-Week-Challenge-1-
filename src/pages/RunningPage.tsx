import React from 'react';
import { PlaceholderState } from '../components/feedback/PlaceholderState';
import { Footprints } from 'lucide-react';

export const RunningPage: React.FC = () => {
  return (
    <div className="running-page">
      <PlaceholderState
        title="Running Companion"
        badge="Section 03 · Outdoor Trail Adventures"
        icon={<Footprints size={24} />}
        description="Your Running Companion is designed to encourage outdoor movement without pressure or competitive stress—helping you enjoy outdoor trails and fresh air."
        featuresList={[
          "Track running distance, duration, and outdoor pace",
          "Discover nature-friendly running routes in your surrounding environment",
          "Gentle customizable reminders from your spirit friend to encourage routine runs",
          "Privacy-first GPS tracking with offline local session saving"
        ]}
        actionText="Back to AI Friend"
        actionPath="/"
      />
    </div>
  );
};
