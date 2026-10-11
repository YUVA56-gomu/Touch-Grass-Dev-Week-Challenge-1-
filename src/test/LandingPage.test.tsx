import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LandingLayout } from '../components/layout/LandingLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { FriendPage } from '../pages/FriendPage';
import { TrackerPage } from '../pages/TrackerPage';
import { RunningPage } from '../pages/RunningPage';
import { CalendarPage } from '../pages/CalendarPage';

describe('TOUCH GRASS — Landing Page & Navigation Suite', () => {
  it('renders the landing-page header with ONLY Home, Features, About, and Meet Sprout (NO Tracker, Running, or Calendar)', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Landing header elements
    const header = container.querySelector('.landing-header') as HTMLElement;
    expect(header).toBeDefined();

    // Brand and allowed navigation links
    expect(header.textContent).toContain('TOUCH GRASS');
    expect(header.textContent).toContain('Home');
    expect(header.textContent).toContain('Features');
    expect(header.textContent).toContain('About');
    expect(header.textContent).toContain('Meet Sprout');

    // MUST NOT display Tracker, Running, or Calendar in landing header
    expect(header.textContent).not.toContain('Tracker');
    expect(header.textContent).not.toContain('Running');
    expect(header.textContent).not.toContain('Calendar');
  });

  it('renders the hero section with exact copy, artwork, reassurance, and CTAs', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    // Headline
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText(/A little less scrolling/i)).toBeDefined();
    expect(screen.getByText(/A little more living/i)).toBeDefined();

    // Supporting text
    expect(screen.getByText(/Meet Sprout, your friendly nature companion/i)).toBeDefined();
    expect(screen.getByText(/Step outside, explore the world, track your adventures/i)).toBeDefined();

    // Reassurance badge
    expect(screen.getByText(/No account needed\. Just step outside\./i)).toBeDefined();

    // Hero artwork image with accessible alt text
    const heroImage = screen.getByRole('img', {
      name: /Sprout, a smiling lime-green nature spirit in a magical 16-bit pixel forest/i,
    });
    expect(heroImage).toBeDefined();
    expect(heroImage.getAttribute('src')).toContain('sprout-hero.png');

    // Primary CTA in Hero
    const primaryCta = container.querySelector('#hero-primary-cta') as HTMLAnchorElement;
    expect(primaryCta).toBeDefined();
    expect(primaryCta.getAttribute('href')).toBe('/friend');
    expect(primaryCta.textContent).toContain('Meet Sprout');

    // Secondary CTA
    const secondaryCta = container.querySelector('#hero-secondary-cta') as HTMLAnchorElement;
    expect(secondaryCta).toBeDefined();
    expect(secondaryCta.getAttribute('href')).toBe('#features');

    // Chat UI elements must NOT be on landing page
    expect(screen.queryByPlaceholderText(/Talk to Sprout/i)).toBeNull();
    expect(screen.queryByRole('img', { name: /Nature mascot spirit/i })).toBeNull();
  });

  it('renders all four core feature cards on the landing page linking to existing routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    // Feature 1: AI Nature Friend
    expect(screen.getAllByText('AI Nature Friend').length).toBeGreaterThan(0);
    expect(screen.getByText(/Talk with Sprout, get thoughtful encouragement/i)).toBeDefined();

    // Feature 2: Outdoor Tracker
    expect(screen.getAllByText('Outdoor Tracker').length).toBeGreaterThan(0);
    expect(screen.getByText(/Record outdoor visits, activities, notes, and progress/i)).toBeDefined();

    // Feature 3: Running Companion
    expect(screen.getAllByText('Running Companion').length).toBeGreaterThan(0);
    expect(screen.getByText(/Track runs with GPS, view your route on a map, and celebrate your finished run/i)).toBeDefined();

    // Feature 4: Nature Calendar
    expect(screen.getAllByText('Nature Calendar').length).toBeGreaterThan(0);
    expect(screen.getByText(/Explore seasonal changes and astronomy-related events/i)).toBeDefined();

    // Verify card action buttons link to existing routes
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));

    expect(hrefs).toContain('/friend');
    expect(hrefs).toContain('/tracker');
    expect(hrefs).toContain('/running');
    expect(hrefs).toContain('/calendar');
  });

  it('renders the 3-step "How It Works" guide faithfully', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/How It Works/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('01').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 3, name: /Meet Sprout/i })).toBeDefined();

    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 3, name: /Head outside and explore/i })).toBeDefined();

    expect(screen.getAllByText('03').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 3, name: /Track your adventures and celebrate small wins/i })).toBeDefined();
  });

  it('renders closing section and footer without auth prompts or fake claims', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    // Closing section
    expect(screen.getByText(/Your next adventure starts outside\./i)).toBeDefined();
    const closingBtn = container.querySelector('#closing-cta-btn') as HTMLAnchorElement;
    expect(closingBtn).toBeDefined();
    expect(closingBtn.getAttribute('href')).toBe('/friend');

    // Footer brand & description
    const footerTitles = screen.getAllByText('TOUCH GRASS');
    expect(footerTitles.length).toBeGreaterThan(0);
    expect(screen.getByText(/16-bit indie nature companion designed to help you spend less time scrolling/i)).toBeDefined();

    // Strictly NO login, signup, authentication, or password inputs/buttons
    expect(screen.queryByText(/sign up/i)).toBeNull();
    expect(screen.queryByText(/log in/i)).toBeNull();
    expect(screen.queryByText(/sign in/i)).toBeNull();
    expect(screen.queryByRole('textbox', { name: /password/i })).toBeNull();
  });

  it('navigates to /friend on Meet Sprout and back to / on Home/logo', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="friend" element={<FriendPage />} />
            <Route path="tracker" element={<TrackerPage />} />
            <Route path="running" element={<RunningPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Initial state on /: Landing page is active, no chat input, no app navigation
    expect(screen.queryByPlaceholderText(/Talk to Sprout/i)).toBeNull();
    const landingHeader = container.querySelector('.landing-header');
    expect(landingHeader).toBeDefined();

    // Click primary hero CTA to navigate to /friend
    const primaryHeroBtn = container.querySelector('#hero-primary-cta') as HTMLAnchorElement;
    expect(primaryHeroBtn).toBeDefined();
    fireEvent.click(primaryHeroBtn);

    // Route /friend is active: Sprout chat panel and mascot rendered, NO landing hero
    expect(screen.getByRole('heading', { level: 1, name: /Meet Sprout/i })).toBeDefined();
    expect(screen.getByRole('img', { name: /Nature mascot spirit/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/Talk to Sprout/i)).toBeDefined();
    expect(screen.queryByText(/A little less scrolling/i)).toBeNull();

    // Now click the brand logo to navigate back to /
    const brandLogo = container.querySelector('.brand-logo') as HTMLAnchorElement;
    expect(brandLogo).toBeDefined();
    fireEvent.click(brandLogo);

    // Route / is active again: Landing page headline present, chat input gone
    expect(screen.getByRole('heading', { level: 1, name: /A little less scrolling/i })).toBeDefined();
    expect(screen.queryByPlaceholderText(/Talk to Sprout/i)).toBeNull();
  });

  it('renders ONLY the respective page on /tracker, /running, and /calendar without landing hero', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/tracker']}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="friend" element={<FriendPage />} />
            <Route path="tracker" element={<TrackerPage />} />
            <Route path="running" element={<RunningPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // On /tracker: Tracker page is rendered, NO landing hero
    expect(screen.getAllByText(/Tracker/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/A little less scrolling/i)).toBeNull();

    // Navigate to /running
    const runningLink = container.querySelector('a[href="/running"]') as HTMLAnchorElement;
    expect(runningLink).toBeDefined();
    fireEvent.click(runningLink);
    expect(screen.getAllByText(/Running/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/A little less scrolling/i)).toBeNull();

    // Navigate to /calendar
    const calendarLink = container.querySelector('a[href="/calendar"]') as HTMLAnchorElement;
    expect(calendarLink).toBeDefined();
    fireEvent.click(calendarLink);
    expect(screen.getAllByText(/Calendar/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/A little less scrolling/i)).toBeNull();
  });
});
