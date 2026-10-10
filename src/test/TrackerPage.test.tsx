import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrackerPage } from '../pages/TrackerPage';
import { StorageEngine } from '../services/storage/StorageEngine';

describe('Milestone 4 — TrackerPage Integration Tests', () => {
  let mockEngine: StorageEngine;

  beforeEach(async () => {
    mockEngine = new StorageEngine();
    await mockEngine.init();
    if (mockEngine.clearAllData) {
      await mockEngine.clearAllData();
    }
  });

  it('renders the empty state when no outdoor visits exist', async () => {
    render(<TrackerPage storageEngine={mockEngine} />);

    await waitFor(() => {
      expect(screen.getByText(/Your Outdoor Journal is Empty/i)).toBeDefined();
    });

    expect(screen.getByText(/Touch Grass Tracker/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Log Your First Visit/i })).toBeDefined();
  });

  it('opens visit form modal when clicking Log Outdoor Visit button', async () => {
    render(<TrackerPage storageEngine={mockEngine} />);

    await waitFor(() => {
      expect(screen.getByText(/Your Outdoor Journal is Empty/i)).toBeDefined();
    });

    const logBtn = screen.getByRole('button', { name: /Log Your First Visit/i });
    fireEvent.click(logBtn);

    expect(screen.getAllByText(/Log Outdoor Visit/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Date of Visit/i)).toBeDefined();
  });

  it('allows logging an outdoor visit and updates the journal view', async () => {
    render(<TrackerPage storageEngine={mockEngine} />);

    await waitFor(() => {
      expect(screen.getByText(/Your Outdoor Journal is Empty/i)).toBeDefined();
    });

    // Open create modal
    const logBtn = screen.getByRole('button', { name: /Log Your First Visit/i });
    fireEvent.click(logBtn);

    // Fill form
    const locationInput = screen.getByPlaceholderText(/e.g. Greenwood Park/i);
    fireEvent.change(locationInput, { target: { value: 'Botanical Gardens' } });

    const durationInput = screen.getByPlaceholderText(/e.g. 30/i);
    fireEvent.change(durationInput, { target: { value: '45' } });

    const notesInput = screen.getByPlaceholderText(/How did the grass, trees, or sunlight feel\?/i);
    fireEvent.change(notesInput, { target: { value: 'Sat under an oak tree and listened to birds.' } });

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /Record Visit/i });
    fireEvent.click(saveBtn);

    // Verify card rendered
    await waitFor(() => {
      expect(screen.getByText('Botanical Gardens')).toBeDefined();
    });

    expect(screen.getByText(/45 mins outdoors/i)).toBeDefined();
    expect(screen.getByText('Sat under an oak tree and listened to birds.')).toBeDefined();
  });

  it('allows editing an existing visit', async () => {
    // Seed visit
    await mockEngine.createVisit({
      dateString: '2026-10-10',
      locationName: 'Oak Park',
      durationMinutes: 30,
      notes: 'Initial notes',
    });

    render(<TrackerPage storageEngine={mockEngine} />);

    await waitFor(() => {
      expect(screen.getByText('Oak Park')).toBeDefined();
    });

    // Click edit button
    const editBtn = screen.getByRole('button', { name: /Edit visit from/i });
    fireEvent.click(editBtn);

    // Update location name
    const locationInput = screen.getByPlaceholderText(/e.g. Greenwood Park/i);
    fireEvent.change(locationInput, { target: { value: 'Oak Park Reserve' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    // Verify updated title
    await waitFor(() => {
      expect(screen.getByText('Oak Park Reserve')).toBeDefined();
    });
  });

  it('prompts confirmation modal before deleting a visit', async () => {
    // Seed visit
    await mockEngine.createVisit({
      dateString: '2026-10-10',
      locationName: 'Sunset Beach',
      durationMinutes: 20,
    });

    render(<TrackerPage storageEngine={mockEngine} />);

    await waitFor(() => {
      expect(screen.getByText('Sunset Beach')).toBeDefined();
    });

    // Click delete
    const deleteBtn = screen.getByRole('button', { name: /Delete visit from/i });
    fireEvent.click(deleteBtn);

    // Verify confirmation modal
    expect(screen.getByText(/Delete Outdoor Memory\?/i)).toBeDefined();

    // Confirm deletion
    const confirmDeleteBtn = screen.getByRole('button', { name: /Yes, Delete Visit/i });
    fireEvent.click(confirmDeleteBtn);

    // Verify deleted
    await waitFor(() => {
      expect(screen.queryByText('Sunset Beach')).toBeNull();
      expect(screen.getByText(/Your Outdoor Journal is Empty/i)).toBeDefined();
    });
  });
});
