import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Footprints,
  Calendar,
  Trees,
  CheckCircle2,
  ArrowRight,
  Sun,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { PixelCard } from '../components/pixel-ui/PixelCard';
import sproutHeroImg from '../assets/sprout-hero.png';
import './LandingPage.css';

interface LandingOutletContext {
  onMeetSprout?: () => void;
}

export const LandingPage: React.FC = () => {
  const outletContext = useOutletContext<LandingOutletContext | null>();
  const onMeetSprout = outletContext?.onMeetSprout;

  const handleMeetSproutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onMeetSprout) {
      e.preventDefault();
      onMeetSprout();
    }
  };

  React.useEffect(() => {
    if (window.location.hash) {
      const elem = document.querySelector(window.location.hash);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('features');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#features');
    }
  };

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="landing-hero" aria-labelledby="hero-heading">
        <div className="landing-hero__content">
          <div className="landing-hero__badge-wrapper">
            <span className="landing-badge font-pixel">
              <Trees size={16} aria-hidden="true" /> 16-BIT NATURE ADVENTURE
            </span>
          </div>

          <h1 id="hero-heading" className="landing-hero__headline font-pixel">
            A little less scrolling.<br />
            <span className="text-lime">A little more living.</span>
          </h1>

          <p className="landing-hero__supporting-text">
            Meet Sprout, your friendly nature companion. Step outside, explore the world,
            track your adventures, and reconnect with the little things.
          </p>

          <div className="landing-hero__cta-group">
            <Link
              to="/friend"
              onClick={handleMeetSproutClick}
              className="pixel-btn-action pixel-btn-action--primary font-pixel"
              id="hero-primary-cta"
            >
              <Sparkles size={18} aria-hidden="true" />
              <span>Meet Sprout</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <a
              href="#features"
              onClick={handleScrollToFeatures}
              className="pixel-btn-action pixel-btn-action--secondary font-pixel"
              id="hero-secondary-cta"
            >
              <span>Explore Features</span>
            </a>
          </div>

          <div className="landing-hero__reassurance font-pixel" role="status">
            <ShieldCheck size={16} className="text-lime" aria-hidden="true" />
            <span>No account needed. Just step outside.</span>
          </div>
        </div>

        {/* Hero Artwork Composition */}
        <div className="landing-hero__visual">
          <div className="hero-artwork-card">
            <div className="hero-artwork-frame">
              <img
                src={sproutHeroImg}
                alt="Sprout, a smiling lime-green nature spirit in a magical 16-bit pixel forest"
                className="hero-artwork-image"
                width={460}
                height={460}
                loading="eager"
              />
            </div>
            <div className="hero-artwork-caption font-pixel">
              <span className="caption-dot" aria-hidden="true" />
              <span>SPROUT · NATURE SPIRIT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Section */}
      <section id="features" className="landing-features" aria-labelledby="features-heading">
        <div className="section-header">
          <span className="section-header__badge font-pixel">
            <Sparkles size={14} aria-hidden="true" /> CORE EXPERIENCES
          </span>
          <h2 id="features-heading" className="section-header__title font-pixel">
            Everything You Need to <span className="text-lime">Step Outside</span>
          </h2>
          <p className="section-header__subtitle">
            Gentle tools crafted to inspire offline exploration, outdoor movement, and mindful connection.
          </p>
        </div>

        <div className="landing-features__grid">
          {/* Card 1: AI Nature Friend */}
          <PixelCard
            title="AI Nature Friend"
            subtitle="Thoughtful Companion"
            icon={<Sparkles size={24} className="feature-icon" />}
            badge="01"
            className="landing-feature-card"
          >
            <p className="feature-card__body">
              Talk with Sprout, get thoughtful encouragement, and explore nature together.
            </p>
            <ul className="feature-card__highlights">
              <li>Warm, encouraging nature dialogues</li>
              <li>Guided 5-minute outdoor mindfulness sessions</li>
              <li>Natural speech audio powered by ElevenLabs</li>
            </ul>
            <div className="feature-card__action">
              <Link to="/friend" onClick={handleMeetSproutClick} className="card-cta-btn font-pixel">
                Meet Sprout <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </PixelCard>

          {/* Card 2: Outdoor Tracker */}
          <PixelCard
            title="Outdoor Tracker"
            subtitle="Habit & Journal"
            icon={<Compass size={24} className="feature-icon" />}
            badge="02"
            className="landing-feature-card"
          >
            <p className="feature-card__body">
              Record outdoor visits, activities, notes, and progress.
            </p>
            <ul className="feature-card__highlights">
              <li>Log daily park visits, hikes, and green spaces</li>
              <li>Attach photos, weather notes, and feelings</li>
              <li>100% local-first and private habit tracking</li>
            </ul>
            <div className="feature-card__action">
              <Link to="/tracker" className="card-cta-btn font-pixel">
                Open Tracker <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </PixelCard>

          {/* Card 3: Running Companion */}
          <PixelCard
            title="Running Companion"
            subtitle="GPS Trail Adventures"
            icon={<Footprints size={24} className="feature-icon" />}
            badge="03"
            className="landing-feature-card"
          >
            <p className="feature-card__body">
              Track runs with GPS, view your route on a map, and celebrate your finished run.
            </p>
            <ul className="feature-card__highlights">
              <li>Live interactive OpenStreetMap route rendering</li>
              <li>Real-time distance, elapsed time, and pace calculation</li>
              <li>Post-run celebration summary with route polyline</li>
            </ul>
            <div className="feature-card__action">
              <Link to="/running" className="card-cta-btn font-pixel">
                Start Running <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </PixelCard>

          {/* Card 4: Nature Calendar */}
          <PixelCard
            title="Nature Calendar"
            subtitle="Seasonal Rhythms"
            icon={<Calendar size={24} className="feature-icon" />}
            badge="04"
            className="landing-feature-card"
          >
            <p className="feature-card__body">
              Explore seasonal changes and astronomy-related events.
            </p>
            <ul className="feature-card__highlights">
              <li>Meteor showers, solstices, and full moon phases</li>
              <li>Daylight duration calculations for your season</li>
              <li>Local wildlife, bloom events, and reminder bookmarks</li>
            </ul>
            <div className="feature-card__action">
              <Link to="/calendar" className="card-cta-btn font-pixel">
                View Calendar <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </PixelCard>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="landing-how" aria-labelledby="how-heading">
        <div className="section-header">
          <span className="section-header__badge font-pixel">
            <Sun size={14} aria-hidden="true" /> SIMPLE & MINDFUL
          </span>
          <h2 id="how-heading" className="section-header__title font-pixel">
            How It Works
          </h2>
          <p className="section-header__subtitle">
            Three simple steps to break the endless scroll cycle and get outdoors.
          </p>
        </div>

        <div className="landing-how__steps">
          <div className="how-step-card">
            <div className="how-step-card__number font-pixel">01</div>
            <div className="how-step-card__content">
              <h3 className="how-step-card__title font-pixel">Meet Sprout</h3>
              <p className="how-step-card__text">
                Start a conversation with your cheerful nature companion right away.
                No passwords, credit cards, or accounts required.
              </p>
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-card__number font-pixel">02</div>
            <div className="how-step-card__content">
              <h3 className="how-step-card__title font-pixel">Head outside and explore</h3>
              <p className="how-step-card__text">
                Step into the fresh air, discover local trails, take a quiet walk, or observe
                the evening sky with a peaceful guided mindfulness session.
              </p>
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-card__number font-pixel">03</div>
            <div className="how-step-card__content">
              <h3 className="how-step-card__title font-pixel">
                Track your adventures and celebrate small wins
              </h3>
              <p className="how-step-card__text">
                Log visits in your personal nature journal, record GPS running routes on maps,
                and tune in to the natural rhythm of the changing seasons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Closing Section */}
      <section className="landing-closing" aria-labelledby="closing-heading">
        <div className="closing-banner">
          <div className="closing-banner__mascot-tag font-pixel">
            <HeartHandshake size={18} aria-hidden="true" /> SPROUT IS READY FOR ADVENTURE
          </div>
          <h2 id="closing-heading" className="closing-banner__title font-pixel">
            Your next adventure starts outside.
          </h2>
          <p className="closing-banner__text">
            Step away from the screen, take a deep breath of fresh air, and let nature
            recharge your mind. Sprout will be cheering you on every step of the way.
          </p>
          <div className="closing-banner__actions">
            <Link
              to="/friend"
              onClick={handleMeetSproutClick}
              className="pixel-btn-action pixel-btn-action--primary font-pixel"
              id="closing-cta-btn"
            >
              <Trees size={18} aria-hidden="true" />
              <span>Let's Go Outside</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="landing-footer" aria-label="Landing page footer">
        <div className="landing-footer__container">
          <div className="landing-footer__brand-col">
            <div className="footer-brand">
              <div className="footer-brand__pixel-icon">
                <img
                  src={sproutHeroImg}
                  alt="TOUCH GRASS Sprout mascot"
                  className="brand-logo__image"
                  width={36}
                  height={36}
                />
              </div>
              <span className="footer-brand__title font-pixel">TOUCH GRASS</span>
            </div>
            <p className="footer-brand__desc">
              A 16-bit indie nature companion designed to help you spend less time scrolling
              and more time reconnecting with the real outdoors.
            </p>
            <p className="footer-brand__privacy font-pixel">
              <CheckCircle2 size={14} className="text-lime" aria-hidden="true" /> Local-first &middot; Zero tracking &middot; No accounts required
            </p>
          </div>

          <nav className="landing-footer__links-col" aria-label="Footer Experiences Navigation">
            <h4 className="footer-links-title font-pixel">Experiences</h4>
            <ul className="footer-links-list">
              <li><Link to="/friend">AI Nature Friend</Link></li>
              <li><Link to="/tracker">Outdoor Tracker</Link></li>
              <li><Link to="/running">Running Companion</Link></li>
              <li><Link to="/calendar">Nature Calendar</Link></li>
            </ul>
          </nav>

          <nav className="landing-footer__links-col" aria-label="Footer Navigation">
            <h4 className="footer-links-title font-pixel">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features" onClick={handleScrollToFeatures}>Features</a></li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', '#how-it-works');
                  }}
                >
                  How It Works
                </a>
              </li>
              <li><Link to="/friend" onClick={handleMeetSproutClick}>Meet Sprout</Link></li>
            </ul>
          </nav>
        </div>

        <div className="landing-footer__bottom">
          <p className="footer-copy font-pixel">
            &copy; 2026 TOUCH GRASS &middot; Hacktoberfest Release &middot; Built with React &amp; FastAPI
          </p>
        </div>
      </footer>
    </div>
  );
};
