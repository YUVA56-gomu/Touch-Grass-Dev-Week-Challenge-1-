import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalendarPage } from '../pages/CalendarPage';
import { CompositeCalendarProvider } from '../services/calendar/CompositeCalendarProvider';

describe('Milestone 6 — CalendarPage Component Integration Tests', () => {
  let mockComposite: CompositeCalendarProvider;

  beforeEach(() => {
    localStorage.clear();
    mockComposite = new CompositeCalendarProvider();
  });

  it('renders the Nature Calendar header, daylight banner, and month title', async () => {
    render(<CalendarPage calendarProvider={mockComposite} />);

    await waitFor(() => {
      expect(screen.getByText(/Today's Sky & Rhythms/i)).toBeDefined();
    });

    expect(screen.getAllByText(/Nature Calendar/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/October 2026/i)).toBeDefined();
    expect(screen.getByText(/Sunrise/i)).toBeDefined();
    expect(screen.getByText(/Sunset/i)).toBeDefined();
  });

  it('navigates between months using Prev and Next buttons', async () => {
    render(<CalendarPage calendarProvider={mockComposite} />);

    await waitFor(() => {
      expect(screen.getByText(/October 2026/i)).toBeDefined();
    });

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/November 2026/i)).toBeDefined();

    const prevBtn = screen.getByRole('button', { name: /Prev/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText(/October 2026/i)).toBeDefined();
  });

  it('filters events by category chips', async () => {
    render(<CalendarPage calendarProvider={mockComposite} />);

    await waitFor(() => {
      expect(screen.getByText(/October 2026/i)).toBeDefined();
    });

    // Click Astronomy category filter
    const astroChip = screen.getByRole('button', { name: /^Astronomy$/i });
    fireEvent.click(astroChip);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Astronomy$/i }).className).toContain('active');
    });
  });

  it('opens event detail modal when clicking an event card', async () => {
    render(<CalendarPage calendarProvider={mockComposite} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Orionid Meteor Shower Peak/i).length).toBeGreaterThan(0);
    });

    const cardTitle = screen.getByText(/Orionid Meteor Shower Peak/i);
    fireEvent.click(cardTitle);

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/Viewing Guidance:/i)).toBeDefined();
    expect(screen.getAllByText(/International Meteor Organization/i).length).toBeGreaterThan(0);
  });

  it('toggles event reminder preference and persists in localStorage', async () => {
    render(<CalendarPage calendarProvider={mockComposite} />);

    await waitFor(() => {
      expect(screen.getByText(/Orionid Meteor Shower Peak/i)).toBeDefined();
    });

    const reminderBtn = screen.getByRole('button', { name: /Set reminder for Orionid Meteor Shower Peak/i });
    fireEvent.click(reminderBtn);

    const saved = localStorage.getItem('touch_grass_event_reminders');
    expect(saved).toBeDefined();
    expect(saved).toContain('astro_orionids_2026');
  });
});
