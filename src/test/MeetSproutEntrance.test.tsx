import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MeetSproutEntrance } from '../features/friend/components/MeetSproutEntrance';
import {
  SPROUT_ENTRANCE_MESSAGES,
  getNextSproutMessage,
  resetSproutMessageMemory,
} from '../features/friend/data/sproutEntranceMessages';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('MeetSproutEntrance Component & Curated Greetings Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSproutMessageMemory();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Curated Messages & Anti-Repetition Logic', () => {
    it('contains at least 15 friendly, energetic nature-inspired messages', () => {
      expect(SPROUT_ENTRANCE_MESSAGES.length).toBeGreaterThanOrEqual(15);
      SPROUT_ENTRANCE_MESSAGES.forEach((msg) => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(10);
      });
    });

    it('never selects the same message twice consecutively across multiple calls', () => {
      let previousMessage = '';
      for (let i = 0; i < 50; i++) {
        const currentMessage = getNextSproutMessage();
        expect(currentMessage).not.toBe(previousMessage);
        previousMessage = currentMessage;
      }
    });

    it('honors overridePrevious parameter correctly', () => {
      const forbidden = SPROUT_ENTRANCE_MESSAGES[0];
      for (let i = 0; i < 20; i++) {
        const message = getNextSproutMessage(forbidden);
        expect(message).not.toBe(forbidden);
      }
    });
  });

  describe('Entrance Modal Interaction & Navigation', () => {
    it('renders the animated entrance dialog with mascot, greeting bubble, and buttons', () => {
      render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={true} onClose={vi.fn()} />
        </MemoryRouter>
      );

      // Dialog container
      expect(screen.getByRole('dialog')).toBeDefined();

      // Animated mascot spirit
      const mascot = screen.getByRole('img', { name: /Nature mascot spirit/i });
      expect(mascot).toBeDefined();

      // Action buttons
      expect(screen.getByRole('button', { name: /Let's go!/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Skip/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Close/i })).toBeDefined();
    });

    it('does not render anything when isOpen is false', () => {
      const { container } = render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={false} onClose={vi.fn()} />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
    });

    it('navigates immediately to /friend when "Let\'s go!" button is clicked', () => {
      const onClose = vi.fn();
      render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={true} onClose={onClose} />
        </MemoryRouter>
      );

      const letsGoBtn = screen.getByRole('button', { name: /Let's go!/i });
      fireEvent.click(letsGoBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/friend');
      expect(onClose).toHaveBeenCalled();
    });

    it('navigates immediately to /friend when "Skip" button is clicked', () => {
      const onClose = vi.fn();
      render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={true} onClose={onClose} />
        </MemoryRouter>
      );

      const skipBtn = screen.getByRole('button', { name: /Skip/i });
      fireEvent.click(skipBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/friend');
      expect(onClose).toHaveBeenCalled();
    });

    it('dismisses modal without navigation when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={true} onClose={onClose} />
        </MemoryRouter>
      );

      const closeBtn = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeBtn);

      expect(onClose).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates automatically after auto-continue duration expires', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();

      render(
        <MemoryRouter>
          <MeetSproutEntrance
            isOpen={true}
            onClose={onClose}
            autoContinueDurationMs={2500}
          />
        </MemoryRouter>
      );

      expect(mockNavigate).not.toHaveBeenCalled();

      // Fast-forward past 2500ms
      act(() => {
        vi.advanceTimersByTime(2600);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/friend');
      expect(onClose).toHaveBeenCalled();
    });

    it('immediately reveals full message when prefers-reduced-motion is true', () => {
      // Mock matchMedia
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const testMsg = "Nature is waiting with open branches!";
      render(
        <MemoryRouter>
          <MeetSproutEntrance
            isOpen={true}
            onClose={vi.fn()}
            initialMessage={testMsg}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(testMsg)).toBeDefined();

      window.matchMedia = originalMatchMedia;
    });

    it('cleans up timers and prevents duplicate navigation on multiple clicks', () => {
      const onClose = vi.fn();
      render(
        <MemoryRouter>
          <MeetSproutEntrance isOpen={true} onClose={onClose} />
        </MemoryRouter>
      );

      const letsGoBtn = screen.getByRole('button', { name: /Let's go!/i });

      // Click twice rapidly
      fireEvent.click(letsGoBtn);
      fireEvent.click(letsGoBtn);

      // Must navigate exactly once
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
