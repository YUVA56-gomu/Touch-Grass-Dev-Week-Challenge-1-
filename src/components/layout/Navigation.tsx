import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Compass, Footprints, Calendar, Sparkles } from 'lucide-react';
import { NavItem } from '../../types';
import sproutHeroImg from '../../assets/sprout-hero.png';
import './Navigation.css';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', iconName: 'Heart', description: 'Landing Page' },
  { id: 'friend', label: 'Sprout', path: '/friend', iconName: 'Sparkles', description: 'AI Friend' },
  { id: 'tracker', label: 'Tracker', path: '/tracker', iconName: 'Compass', description: 'Log Outdoor Visits' },
  { id: 'running', label: 'Running', path: '/running', iconName: 'Footprints', description: 'Outdoor Adventures' },
  { id: 'calendar', label: 'Calendar', path: '/calendar', iconName: 'Calendar', description: 'Nature Events' },
];

export const Navigation: React.FC = () => {
  return (
    <header className="app-header" aria-label="Main Application Navigation">
      <div className="header-container">
        {/* Brand Logo & Title with scaled-down Sprout mascot image */}
        <NavLink to="/" className="brand-logo" aria-label="TOUCH GRASS Home">
          <div className="brand-logo__pixel-icon">
            <img
              src={sproutHeroImg}
              alt="TOUCH GRASS Sprout mascot"
              className="brand-logo__image"
              width={40}
              height={40}
            />
          </div>
          <div className="brand-logo__text">
            <span className="brand-logo__title font-pixel">TOUCH GRASS</span>
            <span className="brand-logo__tagline">Nature Companion</span>
          </div>
        </NavLink>

        {/* Desktop Navigation Header for Application Pages */}
        <nav className="desktop-nav" aria-label="Application Navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                end
              >
                <Heart className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/friend"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Sparkles className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Sprout</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tracker"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Compass className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Tracker</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/running"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Footprints className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Running</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/calendar"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Calendar className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Calendar</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar for Application Pages */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/"
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
          end
        >
          <div className="mobile-nav-icon-wrapper">
            <Heart size={20} />
          </div>
          <span className="mobile-nav-label font-pixel">Home</span>
        </NavLink>
        <NavLink
          to="/friend"
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Sparkles size={20} />
          </div>
          <span className="mobile-nav-label font-pixel">Sprout</span>
        </NavLink>
        <NavLink
          to="/tracker"
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Compass size={20} />
          </div>
          <span className="mobile-nav-label font-pixel">Tracker</span>
        </NavLink>
        <NavLink
          to="/running"
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Footprints size={20} />
          </div>
          <span className="mobile-nav-label font-pixel">Running</span>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Calendar size={20} />
          </div>
          <span className="mobile-nav-label font-pixel">Calendar</span>
        </NavLink>
      </nav>
    </header>
  );
};
