import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Trees, HelpCircle, Sparkles } from 'lucide-react';
import sproutHeroImg from '../../assets/sprout-hero.png';
import './Navigation.css';

export interface LandingHeaderProps {
  onMeetSprout?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onMeetSprout }) => {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('features');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#features');
    }
  };

  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('how-it-works');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#how-it-works');
    }
  };

  const handleMeetSproutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onMeetSprout) {
      e.preventDefault();
      onMeetSprout();
    }
  };

  return (
    <header className="app-header landing-header" aria-label="Landing Page Navigation">
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

        {/* Landing Navigation: Home, Features, About, Meet Sprout all styled consistently */}
        <nav className="desktop-nav" aria-label="Landing Navigation">
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
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="nav-link"
              >
                <Trees className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Features</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#how-it-works"
                onClick={scrollToAbout}
                className="nav-link"
              >
                <HelpCircle className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">About</span>
              </a>
            </li>
            <li className="nav-item">
              <NavLink
                to="/friend"
                onClick={handleMeetSproutClick}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                id="landing-nav-meet-sprout-btn"
                aria-label="Meet Sprout Nature Companion"
              >
                <Sparkles className="nav-icon" size={18} />
                <span className="nav-link__text font-pixel">Meet Sprout</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Mobile quick CTA for Landing Page */}
        <div className="landing-header__mobile-cta">
          <NavLink
            to="/friend"
            onClick={handleMeetSproutClick}
            className="nav-link"
            aria-label="Meet Sprout Nature Companion"
          >
            <Sparkles className="nav-icon" size={18} />
            <span className="nav-link__text font-pixel">Meet Sprout</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
