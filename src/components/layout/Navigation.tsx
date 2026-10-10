import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Compass, Footprints, Calendar, Sparkles } from 'lucide-react';
import { NavItem } from '../../types';
import './Navigation.css';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', iconName: 'Heart', description: 'Your AI Friend' },
  { id: 'tracker', label: 'Tracker', path: '/tracker', iconName: 'Compass', description: 'Log Outdoor Visits' },
  { id: 'running', label: 'Running', path: '/running', iconName: 'Footprints', description: 'Outdoor Adventures' },
  { id: 'calendar', label: 'Calendar', path: '/calendar', iconName: 'Calendar', description: 'Nature Events' },
];

export const Navigation: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'home': return <Heart className="nav-icon" size={20} />;
      case 'tracker': return <Compass className="nav-icon" size={20} />;
      case 'running': return <Footprints className="nav-icon" size={20} />;
      case 'calendar': return <Calendar className="nav-icon" size={20} />;
      default: return <Sparkles className="nav-icon" size={20} />;
    }
  };

  return (
    <header className="app-header">
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
            <span className="brand-logo__tagline">Your Friend</span>
          </div>
        </NavLink>

        {/* Desktop Navigation Header */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link--active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  {getIcon(item.id)}
                  <span className="nav-link__text font-pixel">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`
            }
            end={item.path === '/'}
          >
            <div className="mobile-nav-icon-wrapper">
              {getIcon(item.id)}
            </div>
            <span className="mobile-nav-label font-pixel">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
