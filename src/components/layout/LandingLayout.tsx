import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LandingHeader } from './LandingHeader';
import { NatureBackground } from './NatureBackground';
import { MeetSproutEntrance } from '../../features/friend/components/MeetSproutEntrance';

export const LandingLayout: React.FC = () => {
  const [isEntranceOpen, setIsEntranceOpen] = useState<boolean>(false);

  const handleOpenEntrance = () => {
    setIsEntranceOpen(true);
  };

  const handleCloseEntrance = () => {
    setIsEntranceOpen(false);
  };

  return (
    <NatureBackground>
      <LandingHeader onMeetSprout={handleOpenEntrance} />
      <main className="landing-main-content" id="main-content">
        <Outlet context={{ onMeetSprout: handleOpenEntrance }} />
      </main>
      <MeetSproutEntrance
        isOpen={isEntranceOpen}
        onClose={handleCloseEntrance}
      />
    </NatureBackground>
  );
};
