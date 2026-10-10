import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { NatureBackground } from './NatureBackground';
import './AppLayout.css';

export const AppLayout: React.FC = () => {
  return (
    <NatureBackground>
      <Navigation />
      <main className="app-main-content" id="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="footer-container">
          <p className="font-pixel">🌿 TOUCH GRASS — Reconnect with Nature · Hacktoberfest Project</p>
        </div>
      </footer>
    </NatureBackground>
  );
};
