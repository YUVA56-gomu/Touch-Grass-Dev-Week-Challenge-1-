import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { FriendPage } from '../pages/FriendPage';
import { PixelButton } from '../components/pixel-ui/PixelButton';

describe('TOUCH GRASS Navigation & Foundation Tests', () => {
  it('renders the brand title and navigation items for desktop & mobile', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout />
      </MemoryRouter>
    );

    const brandElements = screen.getAllByText('TOUCH GRASS');
    expect(brandElements.length).toBeGreaterThan(0);

    // Desktop & mobile nav bars render links for all core sections
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tracker').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Running').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Calendar').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sprout').length).toBeGreaterThan(0);
  });

  it('renders the landing page on / without the chat interface', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>
    );

    // Landing page hero is rendered
    expect(screen.getByText(/A little less scrolling/i)).toBeDefined();
    expect(screen.getByText(/A little more living/i)).toBeDefined();

    // Sprout chat input and interactive mascot spirit are NOT rendered on the landing page
    expect(screen.queryByPlaceholderText(/Talk to Sprout/i)).toBeNull();
    expect(screen.queryByRole('img', { name: /Nature mascot spirit/i })).toBeNull();
  });

  it('renders the Sprout chat interface on /friend with mascot and conversation UI', () => {
    render(
      <MemoryRouter initialEntries={['/friend']}>
        <FriendPage />
      </MemoryRouter>
    );

    // Sprout chat page header
    expect(screen.getByRole('heading', { level: 1, name: /Meet Sprout/i })).toBeDefined();

    // Interactive mascot spirit in chat panel
    const mascotImg = screen.getByRole('img', { name: /Nature mascot spirit/i });
    expect(mascotImg).toBeDefined();

    // Chat input exists on /friend
    expect(screen.getByPlaceholderText(/Talk to Sprout/i)).toBeDefined();
  });

  it('renders PixelButton with correct text and variant classes', () => {
    render(
      <PixelButton variant="accent">
        Explore Nature
      </PixelButton>
    );

    const btn = screen.getByRole('button', { name: /Explore Nature/i });
    expect(btn.className).toContain('pixel-btn--accent');
  });
});
