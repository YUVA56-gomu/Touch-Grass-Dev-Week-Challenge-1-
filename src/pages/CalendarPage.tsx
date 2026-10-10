import React from 'react';
import { PlaceholderState } from '../components/feedback/PlaceholderState';
import { Calendar } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  return (
    <div className="calendar-page">
      <PlaceholderState
        title="Nature Calendar"
        badge="Section 04 · Astronomical & Seasonal Guide"
        icon={<Calendar size={24} />}
        description="The Nature Calendar connects you to natural rhythms—alerting you to night sky wonders, seasonal wildlife migrations, and peak blossom periods."
        featuresList={[
          "Astronomical events: Full moons, meteor showers, and planetary alignments",
          "Seasonal transitions: Solstices, equinoxes, and leaf color peaks",
          "Wildlife & botanical phenomena: Bird migrations and spring flower blooms",
          "Calculated and verified natural event status labels"
        ]}
        actionText="Back to AI Friend"
        actionPath="/"
      />
    </div>
  );
};
