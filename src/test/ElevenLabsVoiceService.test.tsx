import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ElevenLabsVoiceService } from '../services/voice/ElevenLabsVoiceService';
import { FriendChatPanel } from '../features/friend/components/FriendChatPanel';

describe('ElevenLabs Voice Integration & Fallback Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('ElevenLabsVoiceService Unit Tests', () => {
    it('fetches voices from backend successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          configured: true,
          voices: [
            { id: 'sprout', name: 'Sprout', description: 'Warm spirit' },
            { id: 'guardian', name: 'Forest Guardian', description: 'Calm narrator' },
          ],
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const result = await service.fetchVoices();

      expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/voice/voices');
      expect(result.configured).toBe(true);
      expect(result.voices.length).toBe(2);
    });

    it('returns unconfigured status on voice fetch failure', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const result = await service.fetchVoices();

      expect(result.configured).toBe(false);
      expect(result.voices.length).toBe(0);
    });

    it('handles speakText success and blob URL creation', async () => {
      const mockAudioBlob = new Blob(['fake-audio-mp3'], { type: 'audio/mpeg' });
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => mockAudioBlob,
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock URL.createObjectURL & revokeObjectURL
      const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/fake-blob');
      const revokeObjectURLMock = vi.fn();
      vi.stubGlobal('URL', {
        createObjectURL: createObjectURLMock,
        revokeObjectURL: revokeObjectURLMock,
      });

      // Mock Audio element
      class MockAudio {
        src = '';
        onended: (() => void) | null = null;
        onerror: (() => void) | null = null;
        play() {
          if (this.onended) setTimeout(this.onended, 10);
          return Promise.resolve();
        }
        pause() {}
      }
      vi.stubGlobal('Audio', MockAudio);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const onStart = vi.fn();
      const onEnd = vi.fn();

      const success = await service.speakText('Hello world', 'sprout', onStart, onEnd);

      expect(success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/voice/speech',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ text: 'Hello world', voice: 'sprout' }),
        })
      );
      expect(createObjectURLMock).toHaveBeenCalledWith(mockAudioBlob);
    });

    it('handles speakText provider error and invokes onError callback', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Text exceeds maximum length of 500 characters' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const onError = vi.fn();

      const success = await service.speakText('Oversized text', 'sprout', undefined, undefined, onError);

      expect(success).toBe(false);
      expect(onError).toHaveBeenCalledWith('Text exceeds maximum length of 500 characters');
    });

    it('transcribes audio blob successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'I love walking in the forest' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const blob = new Blob(['audio data'], { type: 'audio/webm' });
      const transcript = await service.transcribeAudioBlob(blob);

      expect(transcript).toBe('I love walking in the forest');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/voice/transcribe',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws error when transcription endpoint returns failure', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 413,
        json: async () => ({ detail: 'Audio file exceeds limit of 10MB' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const service = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      const blob = new Blob(['large audio data'], { type: 'audio/webm' });

      await expect(service.transcribeAudioBlob(blob)).rejects.toThrow('Audio file exceeds limit of 10MB');
    });
  });

  describe('FriendChatPanel Voice Integration Tests', () => {
    it('renders voice selection and auto-speak controls when ElevenLabs is available', async () => {
      const mockElevenLabs = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      vi.spyOn(mockElevenLabs, 'fetchVoices').mockResolvedValue({
        configured: true,
        voices: [
          { id: 'sprout', name: 'Sprout', description: 'Warm spirit' },
          { id: 'guardian', name: 'Forest Guardian', description: 'Calm narrator' },
        ],
      });

      render(<FriendChatPanel elevenLabsVoiceService={mockElevenLabs} />);

      await waitFor(() => {
        expect(screen.getByText(/ElevenLabs Ready/i)).toBeDefined();
      });

      expect(screen.getByText(/Auto-Speak/i)).toBeDefined();
      expect(screen.getByRole('combobox', { name: /Select Voice Profile/i })).toBeDefined();
    });

    it('allows user to trigger speak action on an assistant message', async () => {
      const mockElevenLabs = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      vi.spyOn(mockElevenLabs, 'fetchVoices').mockResolvedValue({
        configured: true,
        voices: [{ id: 'sprout', name: 'Sprout', description: 'Warm spirit' }],
      });
      const speakSpy = vi.spyOn(mockElevenLabs, 'speakText').mockImplementation(
        async (_text, _voice, onStart) => {
          if (onStart) onStart();
          return true;
        }
      );

      render(<FriendChatPanel elevenLabsVoiceService={mockElevenLabs} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Speak reply/i })).toBeDefined();
      });

      const speakBtn = screen.getByRole('button', { name: /Speak reply/i });
      fireEvent.click(speakBtn);

      expect(speakSpy).toHaveBeenCalledWith(
        expect.stringContaining("Hello there! I'm Sprout"),
        'sprout',
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('provides browser fallback error banner when ElevenLabs synthesis fails', async () => {
      const mockElevenLabs = new ElevenLabsVoiceService('http://127.0.0.1:8000/api/v1');
      vi.spyOn(mockElevenLabs, 'fetchVoices').mockResolvedValue({
        configured: true,
        voices: [{ id: 'sprout', name: 'Sprout', description: 'Warm spirit' }],
      });
      vi.spyOn(mockElevenLabs, 'speakText').mockImplementation(
        async (_text, _voice, _onStart, _onEnd, onError) => {
          if (onError) onError('ElevenLabs quota exceeded');
          return false;
        }
      );

      render(<FriendChatPanel elevenLabsVoiceService={mockElevenLabs} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Speak reply/i })).toBeDefined();
      });

      const speakBtn = screen.getByRole('button', { name: /Speak reply/i });
      fireEvent.click(speakBtn);

      await waitFor(() => {
        expect(screen.getByText(/ElevenLabs Voice Error: ElevenLabs quota exceeded/i)).toBeDefined();
      });
    });
  });
});
