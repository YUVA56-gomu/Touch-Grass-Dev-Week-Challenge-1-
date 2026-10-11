import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import L from 'leaflet';
import { PostRunSummary, getSproutMessage } from '../features/running/components/PostRunSummary';
import { RunRecord } from '../services/storage/types';

describe('Milestone 8.5 — PostRunSummary Component Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const baseRun: RunRecord = {
    id: 'run-101',
    startTime: 1700000000000,
    endTime: 1700001200000,
    dateString: '2026-10-11',
    distanceKm: 3.5,
    durationSeconds: 1200, // 20 mins
    avgPaceMinPerKm: 5.71, // ~5'43" /km
    targetDistanceKm: 3.0,
    hasGpsData: true,
    isRuralFallback: false,
    pathCoordinates: [
      { lat: 12.9716, lng: 77.5946, timestamp: 1000 },
      { lat: 12.975, lng: 77.598, timestamp: 600000 },
      { lat: 12.979, lng: 77.602, timestamp: 1200000 },
    ],
  };

  it('renders a valid post-run summary with distance, time, pace, and route map', () => {
    const handleClose = vi.fn();
    render(<PostRunSummary run={baseRun} onClose={handleClose} />);

    // Header & Badge
    expect(screen.getByText(/Run Completed!/i)).toBeDefined();
    expect(screen.getByText(/2026-10-11 • Session Saved to History/i)).toBeDefined();
    expect(screen.getByText(/GPS Route Tracked/i)).toBeDefined();

    // Stats Grid
    expect(screen.getByText('3.50')).toBeDefined();
    expect(screen.getByText('20:00')).toBeDefined();
    expect(screen.getByText(/5'43" \/km/i)).toBeDefined();
    expect(screen.getByText(/🎯 Goal Achieved!/i)).toBeDefined();

    // Sprout message
    expect(screen.getByText(/Sprout says:/i)).toBeDefined();
    expect(screen.getByText(/trees and trails were cheering for you/i)).toBeDefined();

    // Leaflet route canvas
    expect(screen.getByTestId('post-run-map')).toBeDefined();
    expect(screen.getByText(/Recorded Trail \(3 GPS points\)/i)).toBeDefined();
    expect(screen.getAllByText(/OpenStreetMap/i).length).toBeGreaterThan(0);
  });

  it('verifies Leaflet receives polyline coordinates in [lat, lng] order and fits bounds', () => {
    const polylineSpy = vi.spyOn(L, 'polyline');
    const fitBoundsSpy = vi.spyOn(L.Map.prototype, 'fitBounds');

    render(<PostRunSummary run={baseRun} onClose={vi.fn()} />);

    expect(polylineSpy).toHaveBeenCalled();
    const firstPolylineCall = polylineSpy.mock.calls[0][0] as Array<[number, number]>;
    expect(firstPolylineCall).toEqual([
      [12.9716, 77.5946],
      [12.975, 77.598],
      [12.979, 77.602],
    ]);
    expect(fitBoundsSpy).toHaveBeenCalled();
  });

  it('handles short runs with insufficient distance honestly, displaying Unavailable pace', () => {
    const shortRun: RunRecord = {
      id: 'run-short',
      startTime: 1700000000000,
      endTime: 1700000005000,
      dateString: '2026-10-11',
      distanceKm: 0.02,
      durationSeconds: 4,
      avgPaceMinPerKm: undefined, // undefined because < 50m
      hasGpsData: true,
      isRuralFallback: false,
      pathCoordinates: [
        { lat: 10, lng: 20, timestamp: 1000 },
        { lat: 10.0001, lng: 20.0001, timestamp: 2000 },
      ],
    };

    render(<PostRunSummary run={shortRun} onClose={vi.fn()} />);

    expect(screen.getByText('0.02')).toBeDefined();
    expect(screen.getByText('00:04')).toBeDefined();
    expect(screen.getByText('Unavailable')).toBeDefined();
    expect(screen.getByText(/Requires ≥ 50m of movement/i)).toBeDefined();
    expect(screen.getByText(/Every great journey begins with a single step/i)).toBeDefined();
  });

  it('gracefully handles missing GPS data for timed sessions without rendering empty canvas', () => {
    const timedRun: RunRecord = {
      id: 'run-timed',
      startTime: 1700000000000,
      endTime: 1700000900000,
      dateString: '2026-10-11',
      distanceKm: 0.0,
      durationSeconds: 900, // 15 mins
      avgPaceMinPerKm: undefined,
      hasGpsData: false,
      isRuralFallback: true,
      pathCoordinates: undefined,
    };

    render(<PostRunSummary run={timedRun} onClose={vi.fn()} />);

    expect(screen.getByText('0.00')).toBeDefined();
    expect(screen.getByText('15:00')).toBeDefined();
    expect(screen.getByText('Unavailable')).toBeDefined();
    expect(screen.getByText(/Timed Session/i)).toBeDefined();
    expect(screen.getByTestId('post-run-map-empty')).toBeDefined();
    expect(screen.getByText(/No GPS route recorded for this session/i)).toBeDefined();
    expect(screen.getByText(/Wonderful mindful movement/i)).toBeDefined();
  });

  it('displays single point note when only 1 GPS coordinate is recorded', () => {
    const singlePointRun: RunRecord = {
      id: 'run-single',
      startTime: 1700000000000,
      endTime: 1700000030000,
      dateString: '2026-10-11',
      distanceKm: 0.0,
      durationSeconds: 30,
      hasGpsData: true,
      isRuralFallback: false,
      pathCoordinates: [{ lat: 51.505, lng: -0.09, timestamp: 1000 }],
    };

    render(<PostRunSummary run={singlePointRun} onClose={vi.fn()} />);

    expect(screen.getByTestId('post-run-map')).toBeDefined();
    expect(screen.getByText(/Starting Location Pin \(1 GPS point\)/i)).toBeDefined();
  });

  it('displays goal progress percentage when target goal is not yet reached', () => {
    const partialGoalRun: RunRecord = {
      id: 'run-partial',
      startTime: 1700000000000,
      endTime: 1700000600000,
      dateString: '2026-10-11',
      distanceKm: 2.0,
      durationSeconds: 600,
      targetDistanceKm: 4.0,
      avgPaceMinPerKm: 5.0,
      hasGpsData: true,
      isRuralFallback: false,
    };

    render(<PostRunSummary run={partialGoalRun} onClose={vi.fn()} />);

    expect(screen.getByText(/50% of 4 km goal/i)).toBeDefined();
  });

  it('triggers onClose when clicking action buttons to return to companion', () => {
    const handleClose = vi.fn();
    render(<PostRunSummary run={baseRun} onClose={handleClose} />);

    const startAnotherBtn = screen.getByRole('button', { name: /Start Another Run/i });
    fireEvent.click(startAnotherBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByRole('button', { name: /Back to Running Companion/i });
    fireEvent.click(backBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('evaluates context-appropriate Sprout messages across different run lengths', () => {
    // 6km run
    const epicRun: RunRecord = { ...baseRun, distanceKm: 6.2 };
    expect(getSproutMessage(epicRun)).toContain('Legendary outdoor adventure');

    // 0.8km stroll
    const shortWalk: RunRecord = { ...baseRun, distanceKm: 0.8 };
    expect(getSproutMessage(shortWalk)).toContain('A brisk walk or light jog under the open sky');

    // Timed quick pause
    const quickTimed: RunRecord = {
      ...baseRun,
      distanceKm: 0,
      durationSeconds: 20,
      isRuralFallback: true,
      hasGpsData: false,
    };
    expect(getSproutMessage(quickTimed)).toContain('Even a brief moment outside helps ground your thoughts');
  });
});
