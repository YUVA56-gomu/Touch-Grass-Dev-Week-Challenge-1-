import React, { useState, useEffect, useCallback, useRef } from 'react';
import { defaultStorageEngine } from '../services/storage/StorageEngine';
import { defaultGpsProvider } from '../services/running/BrowserGpsLocationProvider';
import { defaultRouteProvider } from '../services/running/DefaultRouteProvider';
import { RunRecord, IStorageEngine } from '../services/storage/types';
import {
  IGpsLocationProvider,
  IRouteProvider,
  GpsPositionSample,
  GpsError,
} from '../services/running/types';
import {
  calculateHaversineDistance,
  filterGpsSample,
  calculatePace,
} from '../services/running/gpsUtils';
import { getLocalDateString } from '../services/storage/streakUtils';

import { RunGoalSelector } from '../features/running/components/RunGoalSelector';
import { ActiveRunPanel } from '../features/running/components/ActiveRunPanel';
import { RouteDiscoveryPanel } from '../features/running/components/RouteDiscoveryPanel';
import { RunHistoryList } from '../features/running/components/RunHistoryList';
import { LiveRunMap } from '../features/running/components/LiveRunMap';
import { PostRunSummary } from '../features/running/components/PostRunSummary';
import { PixelButton } from '../components/pixel-ui/PixelButton';

import { Footprints, AlertCircle, RefreshCw } from 'lucide-react';
import '../features/running/RunningPage.css';

interface RunningPageProps {
  storageEngine?: IStorageEngine;
  gpsProvider?: IGpsLocationProvider;
  routeProvider?: IRouteProvider;
}

export const RunningPage: React.FC<RunningPageProps> = ({
  storageEngine = defaultStorageEngine,
  gpsProvider = defaultGpsProvider,
  routeProvider = defaultRouteProvider,
}) => {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Active Session State
  const [sessionState, setSessionState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [targetDistanceKm, setTargetDistanceKm] = useState<number | undefined>(3.0);
  const [isTimedOnly, setIsTimedOnly] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [measuredDistanceKm, setMeasuredDistanceKm] = useState<number>(0);
  const [pathCoordinates, setPathCoordinates] = useState<
    Array<{ lat: number; lng: number; timestamp: number }>
  >([]);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  // GPS Status
  const [gpsStatus, setGpsStatus] = useState<
    'searching' | 'tracking' | 'warning' | 'paused' | 'offline'
  >('offline');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [completedRun, setCompletedRun] = useState<RunRecord | null>(null);

  const isSavingRef = useRef<boolean>(false);
  const lastSampleRef = useRef<GpsPositionSample | undefined>(undefined);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Load past runs
  const loadRuns = useCallback(async () => {
    setIsLoading(true);
    setStorageError(null);
    try {
      await storageEngine.init();
      const fetchedRuns = await storageEngine.getRuns();
      setRuns(fetchedRuns);
    } catch (err: any) {
      console.error('Failed to load runs from storage:', err);
      setStorageError(err.message || 'Unable to access local IndexedDB storage.');
    } finally {
      setIsLoading(false);
    }
  }, [storageEngine]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  // Session timer ticker (only ticks when sessionState === 'running')
  useEffect(() => {
    let interval: any = null;
    if (sessionState === 'running') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  // Clean up GPS on unmount
  useEffect(() => {
    return () => {
      gpsProvider.stopTracking();
    };
  }, [gpsProvider]);

  // Start Session Action
  const handleStartSession = (distanceKm?: number, timedOnly = false) => {
    setCompletedRun(null);
    setTargetDistanceKm(distanceKm);
    setIsTimedOnly(timedOnly);
    setElapsedSeconds(0);
    setMeasuredDistanceKm(0);
    setGpsError(null);
    sessionStartTimeRef.current = Date.now();

    setSessionState('running');

    if (timedOnly || !gpsProvider.isSupported()) {
      setPathCoordinates([]);
      setGpsStatus('offline');
      if (!timedOnly && !gpsProvider.isSupported()) {
        setGpsError('Browser Geolocation is not supported. Running in Timed Session mode.');
      }
      return;
    }

    // If we already know the runner's location from standby locate, seed the initial start coordinate
    if (currentPosition) {
      const initialPoint = {
        lat: currentPosition.lat,
        lng: currentPosition.lng,
        timestamp: Date.now(),
      };
      setPathCoordinates([initialPoint]);
      lastSampleRef.current = {
        lat: currentPosition.lat,
        lng: currentPosition.lng,
        accuracy: gpsAccuracy ?? 15,
        timestamp: Date.now(),
      };
      setGpsStatus(gpsAccuracy && gpsAccuracy > 25 ? 'warning' : 'tracking');
    } else {
      setPathCoordinates([]);
      lastSampleRef.current = undefined;
      setGpsStatus('searching');
    }

    gpsProvider.startTracking(
      (sample: GpsPositionSample) => {
        // Always display actual live coordinate and accuracy
        setCurrentPosition({ lat: sample.lat, lng: sample.lng });
        setGpsAccuracy(sample.accuracy);
        setGpsStatus(sample.accuracy > 25 ? 'warning' : 'tracking');

        const prev = lastSampleRef.current;
        // Accept up to 150m accuracy to accommodate real browser Wi-Fi/desktop and outdoor GPS
        if (filterGpsSample(sample, prev, 150)) {
          if (prev) {
            const addedKm = calculateHaversineDistance(prev.lat, prev.lng, sample.lat, sample.lng);
            setMeasuredDistanceKm((oldDist) => oldDist + addedKm);
          }
          lastSampleRef.current = sample;
          setPathCoordinates((oldPath) => [
            ...oldPath,
            { lat: sample.lat, lng: sample.lng, timestamp: sample.timestamp },
          ]);
        }
      },
      (err: GpsError) => {
        console.warn('GPS location error:', err);
        setGpsError(err.message);
        setGpsStatus('offline');
      }
    );
  };

  // Pause / Resume Action
  const handlePauseToggle = () => {
    if (sessionState === 'running') {
      setSessionState('paused');
      setGpsStatus('paused');
    } else if (sessionState === 'paused') {
      setSessionState('running');
      if (!isTimedOnly && lastSampleRef.current) {
        setGpsStatus(lastSampleRef.current.accuracy > 25 ? 'warning' : 'tracking');
      } else {
        setGpsStatus('offline');
      }
    }
  };

  // Finish & Save Session
  const handleFinishSave = async () => {
    // Prevent duplicate saves when finish action is triggered multiple times
    if (isSavingRef.current || sessionState === 'idle') return;
    isSavingRef.current = true;

    gpsProvider.stopTracking();

    const now = Date.now();
    const startTime = sessionStartTimeRef.current;
    const finalDistance = isTimedOnly ? 0 : measuredDistanceKm;
    const avgPace = calculatePace(finalDistance, elapsedSeconds);

    const newRun: Omit<RunRecord, 'id'> = {
      startTime,
      endTime: now,
      dateString: getLocalDateString(now),
      distanceKm: Math.round(finalDistance * 100) / 100,
      durationSeconds: elapsedSeconds,
      avgPaceMinPerKm: avgPace || undefined,
      targetDistanceKm,
      hasGpsData: !isTimedOnly && pathCoordinates.length > 0,
      pathCoordinates: pathCoordinates.length > 0 ? pathCoordinates : undefined,
      isRuralFallback: isTimedOnly || pathCoordinates.length === 0,
    };

    try {
      const savedRecord = await storageEngine.createRun(newRun);
      setSessionState('idle');
      setCurrentPosition(null);
      setGpsAccuracy(null);
      setCompletedRun(savedRecord);
      await loadRuns();
    } catch (err: any) {
      console.error('Failed to save run record:', err);
      setStorageError(err.message || 'Failed to save run session record.');
      setSessionState('idle');
      setCurrentPosition(null);
      setGpsAccuracy(null);
    } finally {
      isSavingRef.current = false;
    }
  };

  // Discard Unfinished Session
  const handleDiscard = () => {
    gpsProvider.stopTracking();
    setSessionState('idle');
    setElapsedSeconds(0);
    setMeasuredDistanceKm(0);
    setPathCoordinates([]);
    setCurrentPosition(null);
    setGpsAccuracy(null);
    lastSampleRef.current = undefined;
  };

  // Standby Location Request (when idle)
  const handleLocateMe = () => {
    if (gpsProvider.isSupported()) {
      setGpsStatus('searching');
      setGpsError(null);
      gpsProvider.startTracking(
        (sample: GpsPositionSample) => {
          setCurrentPosition({ lat: sample.lat, lng: sample.lng });
          setGpsAccuracy(sample.accuracy);
          setGpsStatus(sample.accuracy > 25 ? 'warning' : 'tracking');
          gpsProvider.stopTracking();
        },
        (err: GpsError) => {
          setGpsError(err.message);
          setGpsStatus('offline');
          gpsProvider.stopTracking();
        }
      );
    } else {
      setGpsError('Browser Geolocation is not supported.');
    }
  };

  // Delete Record
  const handleDeleteRun = async (id: string) => {
    await storageEngine.deleteRun(id);
    await loadRuns();
  };

  return (
    <div className="running-page-container">
      {/* Hero Banner Header */}
      <div className="running-hero-banner">
        <div className="running-title-group">
          <h1>
            <Footprints size={28} />
            Running Companion
          </h1>
          <p className="running-subtitle">
            Enjoy non-competitive outdoor runs and walks. Move at your own comfortable pace in nature.
          </p>
        </div>
      </div>

      {/* Storage & GPS Error Banners */}
      {storageError && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={20} />
          <span>{storageError}</span>
          <PixelButton variant="ghost" size="sm" onClick={loadRuns}>
            <RefreshCw size={14} /> Retry
          </PixelButton>
        </div>
      )}

      {gpsError && sessionState !== 'idle' && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={20} />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Dedicated Post-Run Summary when a session finishes */}
      {completedRun ? (
        <PostRunSummary
          run={completedRun}
          onClose={() => setCompletedRun(null)}
        />
      ) : (
        <>
          {/* Active Session HUD or Goal Selector */}
          {sessionState !== 'idle' ? (
            <ActiveRunPanel
              elapsedSeconds={elapsedSeconds}
              distanceKm={measuredDistanceKm}
              isPaused={sessionState === 'paused'}
              gpsStatus={gpsStatus}
              targetDistanceKm={targetDistanceKm}
              isTimedOnly={isTimedOnly}
              onPauseToggle={handlePauseToggle}
              onFinishSave={handleFinishSave}
              onDiscard={handleDiscard}
            />
          ) : (
            <RunGoalSelector onSelectGoal={handleStartSession} />
          )}

          {/* Live GPS Trail Map */}
          <LiveRunMap
            currentPosition={currentPosition}
            pathCoordinates={pathCoordinates}
            gpsStatus={gpsStatus}
            gpsError={gpsError}
            accuracyMeters={gpsAccuracy}
            isSessionActive={sessionState !== 'idle'}
            onStartRun={() => handleStartSession(targetDistanceKm, isTimedOnly)}
            onLocateMe={handleLocateMe}
          />

          {/* Route Discovery Section */}
          <RouteDiscoveryPanel routeProvider={routeProvider} gpsProvider={gpsProvider} />
        </>
      )}

      {/* Recent Run History */}
      {isLoading ? (
        <p style={{ fontFamily: 'Outfit', color: '#D1E7DD', textAlign: 'center' }}>
          Loading your recent run history...
        </p>
      ) : (
        <RunHistoryList runs={runs} onDeleteRun={handleDeleteRun} />
      )}
    </div>
  );
};
