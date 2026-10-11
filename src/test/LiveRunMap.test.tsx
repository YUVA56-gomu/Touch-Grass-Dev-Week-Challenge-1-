import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import L from 'leaflet';
import { LiveRunMap } from '../features/running/components/LiveRunMap';

describe('LiveRunMap Component Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders map card with title and OpenStreetMap attribution', () => {
    render(
      <LiveRunMap
        currentPosition={null}
        pathCoordinates={[]}
        gpsStatus="offline"
        isSessionActive={false}
      />
    );

    expect(screen.getByText(/Live GPS Trail Map/i)).toBeDefined();
    expect(screen.getAllByText(/OpenStreetMap/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('live-run-map')).toBeDefined();
  });

  it('passes Leaflet [lat, lng] coordinate order to polyline setLatLngs', () => {
    const setLatLngsSpy = vi.spyOn(L.Polyline.prototype, 'setLatLngs');

    const testCoords = [
      { lat: 12.9716, lng: 77.5946, timestamp: 1000 },
      { lat: 12.9720, lng: 77.5950, timestamp: 2000 },
    ];

    render(
      <LiveRunMap
        currentPosition={{ lat: 12.9720, lng: 77.5950 }}
        pathCoordinates={testCoords}
        gpsStatus="tracking"
        isSessionActive={true}
      />
    );

    expect(setLatLngsSpy).toHaveBeenCalled();
    // Verify coordinate order is strictly [latitude, longitude]
    const lastCallArg = setLatLngsSpy.mock.calls[setLatLngsSpy.mock.calls.length - 1][0] as Array<[number, number]>;
    expect(lastCallArg).toEqual([
      [12.9716, 77.5946],
      [12.9720, 77.5950],
    ]);
  });

  it('updates polyline when new GPS samples arrive and updates trail points count', () => {
    const initialCoords = [
      { lat: 10.0, lng: 20.0, timestamp: 1000 },
      { lat: 10.001, lng: 20.001, timestamp: 2000 },
    ];

    const { rerender } = render(
      <LiveRunMap
        currentPosition={{ lat: 10.001, lng: 20.001 }}
        pathCoordinates={initialCoords}
        gpsStatus="tracking"
        isSessionActive={true}
      />
    );

    expect(screen.getByText('2')).toBeDefined();

    const updatedCoords = [
      ...initialCoords,
      { lat: 10.002, lng: 20.002, timestamp: 3000 },
      { lat: 10.003, lng: 20.003, timestamp: 4000 },
    ];

    rerender(
      <LiveRunMap
        currentPosition={{ lat: 10.003, lng: 20.003 }}
        pathCoordinates={updatedCoords}
        gpsStatus="tracking"
        isSessionActive={true}
      />
    );

    expect(screen.getByText('4')).toBeDefined();
  });

  it('displays empty standby guidance overlay when no GPS points exist', () => {
    render(
      <LiveRunMap
        currentPosition={null}
        pathCoordinates={[]}
        gpsStatus="offline"
        isSessionActive={false}
      />
    );

    expect(screen.getAllByText(/GPS Standby/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Your real position will appear as a live runner marker/i)).toBeDefined();
    expect(screen.getByText('0')).toBeDefined();
  });

  it('displays inaccurate GPS badge with precision in meters when accuracy is low', () => {
    render(
      <LiveRunMap
        currentPosition={{ lat: 12.97, lng: 77.59 }}
        pathCoordinates={[{ lat: 12.97, lng: 77.59 }]}
        gpsStatus="warning"
        accuracyMeters={85.4}
        isSessionActive={true}
      />
    );

    expect(screen.getByText(/Approx GPS \(±85m\)/i)).toBeDefined();
    expect(screen.getByText(/GPS Precision: ±85m/i)).toBeDefined();
  });

  it('displays permission denied notice gracefully when GPS error occurs', () => {
    render(
      <LiveRunMap
        currentPosition={null}
        pathCoordinates={[]}
        gpsStatus="offline"
        gpsError="User denied Geolocation permission."
        isSessionActive={false}
      />
    );

    expect(screen.getByText(/Location Notice: User denied Geolocation permission./i)).toBeDefined();
    expect(screen.getByText(/Please ensure browser location permission is granted./i)).toBeDefined();
  });

  it('allows toggling follow and recentering mode', () => {
    render(
      <LiveRunMap
        currentPosition={{ lat: 12.97, lng: 77.59 }}
        pathCoordinates={[{ lat: 12.97, lng: 77.59 }]}
        gpsStatus="tracking"
        isSessionActive={true}
      />
    );

    // Initial state is following
    const followBtn = screen.getByRole('button', { name: /Following/i });
    expect(followBtn).toBeDefined();

    // Clicking toggles follow mode
    fireEvent.click(followBtn);
    expect(screen.getByRole('button', { name: /Follow Me/i })).toBeDefined();

    // Clicking again resumes following
    fireEvent.click(screen.getByRole('button', { name: /Follow Me/i }));
    expect(screen.getByRole('button', { name: /Following/i })).toBeDefined();
  });

  it('triggers onStartRun when clicking Start Run button on map overlay', () => {
    const handleStartRun = vi.fn();

    render(
      <LiveRunMap
        currentPosition={{ lat: 12.97, lng: 77.59 }}
        pathCoordinates={[]}
        gpsStatus="tracking"
        isSessionActive={false}
        onStartRun={handleStartRun}
      />
    );

    const startBtn = screen.getByRole('button', { name: /Start Run/i });
    fireEvent.click(startBtn);

    expect(handleStartRun).toHaveBeenCalledTimes(1);
  });

  it('shows movement guidance banner when active run has fewer than 2 points', () => {
    render(
      <LiveRunMap
        currentPosition={{ lat: 12.97, lng: 77.59 }}
        pathCoordinates={[{ lat: 12.97, lng: 77.59 }]}
        gpsStatus="tracking"
        isSessionActive={true}
      />
    );

    expect(
      screen.getByText(/Outdoor run active! Move to record your path \(line draws with 2\+ points\)\./i)
    ).toBeDefined();
  });
});
