import React, { useState, useEffect, useCallback } from 'react';
import { defaultCompositeCalendarProvider } from '../services/calendar/CompositeCalendarProvider';
import {
  NatureEvent,
  EventCategory,
  DaylightTimes,
  MoonPhaseInfo,
} from '../services/calendar/types';
import { getLocalDateString } from '../services/storage/streakUtils';

import { DaylightBanner } from '../features/calendar/components/DaylightBanner';
import { MonthNavigationHeader } from '../features/calendar/components/MonthNavigationHeader';
import { EventCard } from '../features/calendar/components/EventCard';
import { EventDetailModal } from '../features/calendar/components/EventDetailModal';
import { PixelCard } from '../components/pixel-ui/PixelCard';

import { Calendar, Sparkles } from 'lucide-react';
import '../features/calendar/CalendarPage.css';

interface CalendarPageProps {
  calendarProvider?: typeof defaultCompositeCalendarProvider;
}

const REMINDERS_KEY = 'touch_grass_event_reminders';

export const CalendarPage: React.FC<CalendarPageProps> = ({
  calendarProvider = defaultCompositeCalendarProvider,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // October 2026
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const [events, setEvents] = useState<NatureEvent[]>([]);
  const [daylight, setDaylight] = useState<DaylightTimes>(() =>
    calendarProvider.getDaylightTimes('2026-10-10')
  );
  const [moon, setMoon] = useState<MoonPhaseInfo>(() =>
    calendarProvider.getMoonPhase('2026-10-10')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<NatureEvent | null>(null);

  // User location state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Local Reminder Preferences
  const [reminders, setReminders] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(REMINDERS_KEY);
        if (saved) return new Set(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
    return new Set();
  });

  const saveReminders = (newSet: Set<string>) => {
    setReminders(newSet);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(REMINDERS_KEY, JSON.stringify(Array.from(newSet)));
      } catch (e) {
        // ignore
      }
    }
  };

  const handleToggleReminder = (eventId: string) => {
    const updated = new Set(reminders);
    if (updated.has(eventId)) {
      updated.delete(eventId);
    } else {
      updated.add(eventId);
    }
    saveReminders(updated);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const lat = userCoords?.lat;

      const monthEvents = await calendarProvider.getEventsForMonth(
        currentYear,
        currentMonth,
        selectedCategory
      );

      const todayStr = getLocalDateString();
      const daylightTimes = calendarProvider.getDaylightTimes(todayStr, lat);
      const moonInfo = calendarProvider.getMoonPhase(todayStr);

      setEvents(monthEvents);
      setDaylight(daylightTimes);
      setMoon(moonInfo);
    } catch (err) {
      console.error('Failed to load nature calendar events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [calendarProvider, currentYear, currentMonth, selectedCategory, userCoords]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  const handleRequestLocation = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (err) => {
          console.warn('Geolocation denied or failed:', err);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  return (
    <div className="calendar-page-container">
      {/* Hero Banner */}
      <div className="calendar-hero-banner">
        <div className="calendar-title-group">
          <h1>
            <Calendar size={28} />
            Nature Calendar
          </h1>
          <p className="calendar-subtitle">
            Notice astronomical wonders, seasonal changes, wildflower peaks, and outdoor observances.
          </p>
        </div>
      </div>

      {/* Daylight & Moon Rhythms Banner */}
      <DaylightBanner
        daylight={daylight}
        moon={moon}
        isCustomLocation={userCoords !== undefined}
        onRequestLocation={handleRequestLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Month Navigation & Category Filters */}
      <MonthNavigationHeader
        currentYear={currentYear}
        currentMonth={currentMonth}
        selectedCategory={selectedCategory}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onSelectCategory={setSelectedCategory}
      />

      {/* Events List Grid / Empty State */}
      {isLoading ? (
        <PixelCard className="empty-events-card">
          <p style={{ fontFamily: 'Outfit', color: '#D1E7DD' }}>Loading nature calendar events...</p>
        </PixelCard>
      ) : events.length === 0 ? (
        <PixelCard className="empty-events-card">
          <Sparkles size={40} style={{ color: 'var(--color-lime)', marginBottom: '0.5rem' }} />
          <h3 style={{ fontFamily: 'VT323', fontSize: '1.8rem', color: 'var(--color-warm-sunlight)', margin: 0 }}>
            No Events for Selected Category
          </h3>
          <p style={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#D1E7DD', marginTop: '0.5rem' }}>
            Try selecting "All Events" or navigating to another month.
          </p>
        </PixelCard>
      ) : (
        <div className="events-list-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isReminderSet={reminders.has(event.id)}
              onToggleReminder={handleToggleReminder}
              onSelectEvent={setSelectedEvent}
            />
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      <EventDetailModal
        isOpen={selectedEvent !== null}
        event={selectedEvent}
        isReminderSet={selectedEvent ? reminders.has(selectedEvent.id) : false}
        onClose={() => setSelectedEvent(null)}
        onToggleReminder={handleToggleReminder}
      />
    </div>
  );
};
