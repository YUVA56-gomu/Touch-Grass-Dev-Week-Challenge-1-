import React, { useState } from 'react';
import { FriendChatPanel } from '../features/friend/components/FriendChatPanel';
import { GuidedNatureSession } from '../features/friend/components/GuidedNatureSession';
import { Trees } from 'lucide-react';
import './FriendPage.css';

export const FriendPage: React.FC = () => {
  const [isGuidedSessionOpen, setIsGuidedSessionOpen] = useState<boolean>(false);

  return (
    <div className="friend-page">
      {/* Clean Sprout Page Header */}
      <header className="friend-page-header">
        <div className="friend-page-header__badge font-pixel">
          <Trees size={16} aria-hidden="true" /> AI NATURE COMPANION
        </div>
        <h1 className="friend-page-header__title font-pixel">
          Meet <span className="text-lime">Sprout</span>
        </h1>
        <p className="friend-page-header__subtitle">
          Your friendly 16-bit nature spirit. Chat freely, reflect on your outdoor experiences,
          or take a mindful 5-minute nature pause.
        </p>
      </header>

      {/* Main Interactive AI Friend Chat Panel */}
      <section className="friend-chat-section" aria-label="Sprout Conversation">
        <FriendChatPanel
          onLaunchGuidedSession={() => setIsGuidedSessionOpen(true)}
        />
      </section>

      {/* Modal for Guided Nature Session */}
      <GuidedNatureSession
        isOpen={isGuidedSessionOpen}
        onClose={() => setIsGuidedSessionOpen(false)}
      />
    </div>
  );
};
