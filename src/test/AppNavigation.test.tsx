import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
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

    // Desktop & mobile nav bars render links for all 4 sections
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tracker').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Running').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Calendar').length).toBeGreaterThan(0);
  });

  it('renders the mascot spirit on the Home Page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to/i)).toBeDefined();

    const mascotImg = screen.getByRole('img', { name: /Nature mascot spirit/i });
    expect(mascotImg).toBeDefined();
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
