import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RunningPage } from '../pages/RunningPage';
import { StorageEngine } from '../services/storage/StorageEngine';
import { IGpsLocationProvider, GpsPositionSample, GpsError } from '../services/running/types';
import { DefaultRouteProvider } from '../services/running/DefaultRouteProvider';

class MockGpsProvider implements IGpsLocationProvider {
  private supported = true;
  private onSampleCb: ((s: GpsPositionSample) => void) | null = null;
  private onErrorCb: ((e: GpsError) => void) | null = null;

  public isSupported(): boolean {
    return this.supported;
  }

  public setSupported(val: boolean) {
    this.supported = val;
  }

  public startTracking(
    onSample: (sample: GpsPositionSample) => void,
    onError: (err: GpsError) => void
  ): boolean {
    if (!this.supported) {
      onError({ code: 'UNSUPPORTED', message: 'GPS Unsupported' });
      return false;
    }
    this.onSampleCb = onSample;
    this.onErrorCb = onError;
    // Emit initial position sample immediately
    onSample({ lat: 37.7749, lng: -122.4194, accuracy: 10, timestamp: Date.now() });
    return true;
  }

  public stopTracking(): void {
    this.onSampleCb = null;
    this.onErrorCb = null;
  }

  public emitSample(sample: GpsPositionSample) {
    if (this.onSampleCb) this.onSampleCb(sample);
  }

  public emitError(err: GpsError) {
    if (this.onErrorCb) this.onErrorCb(err);
  }
}

describe('Milestone 5 — RunningPage Component Integration Tests', () => {
  let mockEngine: StorageEngine;
  let mockGps: MockGpsProvider;
  let mockRouteProvider: DefaultRouteProvider;

  beforeEach(async () => {
    mockEngine = new StorageEngine();
    await mockEngine.init();
    if (mockEngine.clearAllData) {
      await mockEngine.clearAllData();
    }
    mockGps = new MockGpsProvider();
    mockRouteProvider = new DefaultRouteProvider();
  });

  it('renders the Running Companion header and empty run history', async () => {
    render(
      <RunningPage
        storageEngine={mockEngine}
        gpsProvider={mockGps}
        routeProvider={mockRouteProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/No Run Records Yet/i)).toBeDefined();
    });

    expect(screen.getAllByText(/Running Companion/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    expect(screen.getByText(/Live GPS Trail Map/i)).toBeDefined();
    expect(screen.getByTestId('live-run-map')).toBeDefined();
  });

  it('starts an active outdoor session, pauses/resumes, and finishes saving to history', async () => {
    render(
      <RunningPage
        storageEngine={mockEngine}
        gpsProvider={mockGps}
        routeProvider={mockRouteProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    });

    // Start session
    const startBtn = screen.getByRole('button', { name: /Start Outdoor Session/i });
    fireEvent.click(startBtn);

    // Active HUD rendered
    expect(screen.getByText(/Active Outdoor Session/i)).toBeDefined();
    expect(screen.getByText(/Elapsed Time/i)).toBeDefined();

    // Emit GPS positions
    mockGps.emitSample({ lat: 37.7749, lng: -122.4194, accuracy: 10, timestamp: 1000 });
    mockGps.emitSample({ lat: 37.7780, lng: -122.4220, accuracy: 10, timestamp: 60000 });

    // Pause toggle
    const pauseBtn = screen.getByRole('button', { name: /Pause/i });
    fireEvent.click(pauseBtn);
    expect(screen.getAllByText(/Session Paused/i).length).toBeGreaterThan(0);

    const resumeBtn = screen.getByRole('button', { name: /Resume Session/i });
    fireEvent.click(resumeBtn);

    // Finish & save
    const finishBtn = screen.getByRole('button', { name: /Finish & Save/i });
    fireEvent.click(finishBtn);

    // Verify post-run summary is displayed
    await waitFor(() => {
      expect(screen.getByText(/Run Completed!/i)).toBeDefined();
    });
    expect(screen.getByText(/Sprout says:/i)).toBeDefined();

    // Verify run record saved to history
    expect(screen.getByText(/Recent Running & Stroll History/i)).toBeDefined();

    // Tapping Start Another Run returns to the companion goal selector
    const startAnotherBtn = screen.getByRole('button', { name: /Start Another Run/i });
    fireEvent.click(startAnotherBtn);

    await waitFor(() => {
      expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    });
  });

  it('prevents duplicate saves when finish action is clicked multiple times', async () => {
    const createRunSpy = vi.spyOn(mockEngine, 'createRun');

    render(
      <RunningPage
        storageEngine={mockEngine}
        gpsProvider={mockGps}
        routeProvider={mockRouteProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    });

    // Start session
    const startBtn = screen.getByRole('button', { name: /Start Outdoor Session/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/Active Outdoor Session/i)).toBeDefined();

    const finishBtn = screen.getByRole('button', { name: /Finish & Save/i });
    // Simulate rapid repeated clicks
    fireEvent.click(finishBtn);
    fireEvent.click(finishBtn);
    fireEvent.click(finishBtn);

    await waitFor(() => {
      expect(screen.getByText(/Run Completed!/i)).toBeDefined();
    });

    // Verify createRun was called exactly once
    expect(createRunSpy).toHaveBeenCalledTimes(1);

    const savedRuns = await mockEngine.getRuns();
    expect(savedRuns.length).toBe(1);
  });

  it('allows discarding an unfinished session without saving', async () => {
    render(
      <RunningPage
        storageEngine={mockEngine}
        gpsProvider={mockGps}
        routeProvider={mockRouteProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    });

    // Start session
    const startBtn = screen.getByRole('button', { name: /Start Outdoor Session/i });
    fireEvent.click(startBtn);

    // Click discard
    const discardBtn = screen.getByRole('button', { name: /Discard/i });
    fireEvent.click(discardBtn);

    // Confirmation dialog
    expect(screen.getByText(/Discard Current Session\?/i)).toBeDefined();

    const confirmDiscardBtn = screen.getByRole('button', { name: /Discard Session/i });
    fireEvent.click(confirmDiscardBtn);

    // Returned to goal selector without history record
    await waitFor(() => {
      expect(screen.getByText(/Set Your Outdoor Goal/i)).toBeDefined();
    });
    expect(screen.getByText(/No Run Records Yet/i)).toBeDefined();
  });

  it('discovers route candidates with OpenStreetMap attribution', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            distance: 3200,
            geometry: {
              coordinates: [
                [-122.4194, 37.7749],
                [-122.42, 37.776],
              ],
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(
      <RunningPage
        storageEngine={mockEngine}
        gpsProvider={mockGps}
        routeProvider={mockRouteProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Nature Route Discovery/i)).toBeDefined();
    });

    const discoverBtn = screen.getByRole('button', { name: /Find Nearby Trails/i });
    fireEvent.click(discoverBtn);

    await waitFor(() => {
      expect(screen.getByText(/OSRM Pedestrian Trail/i)).toBeDefined();
    });

    expect(screen.getAllByText(/OpenStreetMap/i).length).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });
});
