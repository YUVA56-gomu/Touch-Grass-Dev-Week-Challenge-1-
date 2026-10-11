import React from 'react';
import { Outlet } from 'react-router-dom';
import { LandingHeader } from './LandingHeader';
import { NatureBackground } from './NatureBackground';

export const LandingLayout: React.FC = () => {
  return (
    <NatureBackground>
      <LandingHeader />
      <main className="landing-main-content" id="main-content">
        <Outlet />
      </main>
    </NatureBackground>
  );
};
