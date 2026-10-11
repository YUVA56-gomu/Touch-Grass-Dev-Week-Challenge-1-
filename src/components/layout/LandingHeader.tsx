import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Trees, HelpCircle, Sparkles } from 'lucide-react';
import './Navigation.css';

export const LandingHeader: React.FC = () => {
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

  return (
    <header className="app-header landing-header" aria-label="Landing Page Navigation">
      <div className="header-container">
        {/* Brand Logo & Title */}
        <NavLink to="/" className="brand-logo" aria-label="TOUCH GRASS Home">
          <div className="brand-logo__pixel-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" shapeRendering="crispEdges">
              <path d="M14 2h4v2h-4zM12 4h2v2h-2zM18 4h2v2h-2zM10 6h12v20H10z" fill="#174B35" />
              <path d="M14 6h4v4h-4zM12 10h8v12h-8z" fill="#C8F36A" />
              <rect x="13" y="12" width="2" height="3" fill="#174B35" />
              <rect x="17" y="12" width="2" height="3" fill="#174B35" />
              <rect x="12" y="17" width="2" height="2" fill="#F8A5C2" />
              <rect x="18" y="17" width="2" height="2" fill="#F8A5C2" />
              <path d="M14 18h4v2h-4z" fill="#174B35" />
            </svg>
          </div>
          <div className="brand-logo__text">
            <span className="brand-logo__title font-pixel">TOUCH GRASS</span>
            <span className="brand-logo__tagline">Nature Companion</span>
          </div>
        </NavLink>

        {/* Landing Navigation: Home, Features, About, Meet Sprout ONLY */}
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
                className="nav-cta-btn font-pixel"
                id="landing-nav-meet-sprout-btn"
                aria-label="Meet Sprout Nature Companion"
              >
                <Sparkles size={16} />
                <span>Meet Sprout</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Mobile quick CTA for Landing Page */}
        <div className="landing-header__mobile-cta">
          <NavLink
            to="/friend"
            className="nav-cta-btn font-pixel"
            aria-label="Meet Sprout Nature Companion"
          >
            <Sparkles size={16} />
            <span>Meet Sprout</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
