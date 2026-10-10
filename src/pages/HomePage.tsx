import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FriendChatPanel } from '../features/friend/components/FriendChatPanel';
import { GuidedNatureSession } from '../features/friend/components/GuidedNatureSession';
import { PixelCard } from '../components/pixel-ui/PixelCard';
import { Compass, Footprints, Calendar, Trees } from 'lucide-react';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isGuidedSessionOpen, setIsGuidedSessionOpen] = useState<boolean>(false);

  return (
    <div className="home-page">
      {/* Hero Welcome Header */}
      <section className="home-hero-header">
        <div className="home-hero__welcome-header">
          <span className="home-hero__badge font-pixel">
            <Trees size={16} /> 16-BIT NATURE WORLD
          </span>
          <h1 className="home-hero__title font-pixel">
            Welcome to <span className="text-lime">TOUCH GRASS</span>
          </h1>
          <p className="home-hero__subtitle">
            Your friendly nature spirit is here to help you slow down, step outside, and enjoy the real world around you.
          </p>
        </div>
      </section>

      {/* Main Interactive AI Friend Chat Panel */}
      <section className="home-chat-section">
        <FriendChatPanel
          onLaunchGuidedSession={() => setIsGuidedSessionOpen(true)}
        />
      </section>

      {/* Modal for Guided Nature Session */}
      <GuidedNatureSession
        isOpen={isGuidedSessionOpen}
        onClose={() => setIsGuidedSessionOpen(false)}
      />

      {/* Feature Cards Grid (Links to other 3 sections) */}
      <section className="home-features">
        <h2 className="home-features__heading font-pixel">
          Explore Your Nature Companion
        </h2>
        <p className="home-features__subheading">
          Four gentle ways to reconnect with the outdoors every day.
        </p>

        <div className="home-features__grid">
          {/* Touch Grass Tracker Card */}
          <PixelCard
            title="Touch Grass Tracker"
            subtitle="Outdoor Visits & Memories"
            icon={<Compass size={24} />}
            badge="Section 02"
            interactive={true}
            onClick={() => navigate('/tracker')}
          >
            <p className="feature-card__desc">
              Log your daily outdoor visits, store peaceful photos, and build a lasting habit of connecting with nature.
            </p>
            <div className="feature-card__footer">
              <span className="feature-card__link font-pixel">Open Tracker &rarr;</span>
            </div>
          </PixelCard>

          {/* Running Companion Card */}
          <PixelCard
            title="Running Companion"
            subtitle="Outdoor Trail Adventures"
            icon={<Footprints size={24} />}
            badge="Section 03"
            interactive={true}
            onClick={() => navigate('/running')}
          >
            <p className="feature-card__desc">
              Track your outdoor running distance, discover peaceful nature routes, and stay motivated with friendly spirit prompts.
            </p>
            <div className="feature-card__footer">
              <span className="feature-card__link font-pixel">Start Running &rarr;</span>
            </div>
          </PixelCard>

          {/* Nature Calendar Card */}
          <PixelCard
            title="Nature Calendar"
            subtitle="Astronomical & Seasonal Events"
            icon={<Calendar size={24} />}
            badge="Section 04"
            interactive={true}
            onClick={() => navigate('/calendar')}
          >
            <p className="feature-card__desc">
              Never miss a meteor shower, full moon, seasonal blossom, or local wildlife moment happening in your area.
            </p>
            <div className="feature-card__footer">
              <span className="feature-card__link font-pixel">View Calendar &rarr;</span>
            </div>
          </PixelCard>
        </div>
      </section>
    </div>
  );
};
