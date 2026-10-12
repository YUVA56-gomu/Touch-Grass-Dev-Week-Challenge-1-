import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockAIProvider } from '../services/ai/MockAIProvider';
import { VoiceService } from '../services/voice/VoiceService';
import { AudioEngine } from '../services/audio/AudioEngine';
import { FriendChatPanel } from '../features/friend/components/FriendChatPanel';
import { GuidedNatureSession } from '../features/friend/components/GuidedNatureSession';

describe('Milestone 3 — AI Friend Engine & Guided Nature Experience Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('MockAIProvider Suite', () => {
    it('returns friendly nature spirit responses for prompt', async () => {
      const provider = new MockAIProvider();
      const res = await provider.sendMessage('Tell me a forest story');

      expect(res.replyText).toContain('forest');
      expect(res.expression).toBe('excited');
      expect(res.suggestedPrompts).toBeDefined();
    });

    it('handles simulated failure correctly', async () => {
      const provider = new MockAIProvider();
      provider.setShouldFailNext(true);

      await expect(provider.sendMessage('Hello')).rejects.toThrow('Simulated network error');
    });

    it('supports request cancellation', async () => {
      const provider = new MockAIProvider();
      const promise = provider.sendMessage('Test prompt');
      provider.cancelRequest();

      await expect(promise).rejects.toThrow('cancelled');
    });
  });

  describe('FastAPILLMAdapter Suite', () => {
    it('sends POST request to backend and parses successful response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reply_text: 'Hello from FastAPI backend!',
          expression: 'happy',
          suggested_prompts: ['Option A'],
          is_mock: false,
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const adapter = new (await import('../services/ai/FastAPILLMAdapter')).FastAPILLMAdapter('http://127.0.0.1:8000/api/v1');
      const res = await adapter.sendMessage('Hello backend');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/ai/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(res.replyText).toBe('Hello from FastAPI backend!');
      expect(res.isMock).toBe(false);

      vi.unstubAllGlobals();
    });

    it('handles Ollama Local Gemma response and preserves providerName', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reply_text: 'Deep breaths under the trees! Feel the earth beneath your feet.',
          expression: 'happy',
          suggested_prompts: ['Forest story', 'Breathe'],
          is_mock: false,
          provider_name: 'Ollama Local Gemma (gemma2:2b)',
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const adapter = new (await import('../services/ai/FastAPILLMAdapter')).FastAPILLMAdapter('http://127.0.0.1:8000/api/v1');
      const res = await adapter.sendMessage('Tell me about nature');

      expect(res.replyText).toContain('Deep breaths');
      expect(res.isMock).toBe(false);
      expect(res.providerName).toBe('Ollama Local Gemma (gemma2:2b)');

      vi.unstubAllGlobals();
    });

    it('falls back to MockAIProvider when backend fetch fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      const adapter = new (await import('../services/ai/FastAPILLMAdapter')).FastAPILLMAdapter('http://127.0.0.1:8000/api/v1');
      const res = await adapter.sendMessage('Hello offline');

      expect(res.replyText).toBeDefined();
      expect(res.isMock).toBe(true);
      expect(res.providerName).toContain('Offline Fallback');

      vi.unstubAllGlobals();
    });
  });

  describe('VoiceService Suite', () => {
    it('gracefully reports unsupported status when Speech API is missing', () => {
      const voiceService = new VoiceService();
      expect(voiceService.isRecognitionSupported()).toBe(false);

      const onErr = vi.fn();
      const result = voiceService.startListening(vi.fn(), onErr);

      expect(result).toBe(false);
      expect(onErr).toHaveBeenCalledWith(expect.stringContaining('not supported'));
    });
  });

  describe('AudioEngine Suite', () => {
    it('supports scene selection, volume control, and mute toggle', () => {
      const audioEngine = new AudioEngine();
      expect(audioEngine.getScene()).toBe('forest');

      audioEngine.setScene('meadow');
      expect(audioEngine.getScene()).toBe('meadow');

      audioEngine.setVolume(0.8);
      expect(audioEngine.getVolume()).toBe(0.8);

      const isMuted = audioEngine.toggleMute();
      expect(isMuted).toBe(true);
      expect(audioEngine.getIsMuted()).toBe(true);

      audioEngine.cleanup();
    });
  });

  describe('FriendChatPanel Integration', () => {
    it('persists and customizes friend name in localStorage', async () => {
      const { container } = render(<FriendChatPanel />);

      // Edit name button
      const editBtn = screen.getByRole('button', { name: /Edit Friend Name/i });
      fireEvent.click(editBtn);

      const input = container.querySelector('.friend-name-input') as HTMLInputElement;
      expect(input).toBeDefined();
      fireEvent.change(input, { target: { value: 'Leafy' } });

      const saveBtn = screen.getByRole('button', { name: /Save Friend Name/i });
      fireEvent.click(saveBtn);

      expect(localStorage.getItem('touch_grass_friend_name')).toBe('Leafy');
      expect(screen.getAllByText('Leafy').length).toBeGreaterThan(0);
    });

    it('prevents sending empty text prompts', () => {
      render(<FriendChatPanel />);

      const sendBtn = screen.getByRole('button', { name: /Send/i });
      expect((sendBtn as HTMLButtonElement).disabled).toBe(true);
    });

    it('sends user message and displays assistant response', async () => {
      const provider = new MockAIProvider();
      render(<FriendChatPanel aiProvider={provider} />);

      const textInput = screen.getByPlaceholderText(/Talk to Sprout.../i);
      fireEvent.change(textInput, { target: { value: 'Why is touching grass good for me?' } });

      const sendBtn = screen.getByRole('button', { name: /Send/i });
      fireEvent.click(sendBtn);

      // User message rendered
      expect(screen.getByText('Why is touching grass good for me?')).toBeDefined();

      // Wait for assistant response
      await waitFor(() => {
        expect(screen.getByText(/Stepping outdoors grounds our senses!/i)).toBeDefined();
      });
    });
  });

  describe('GuidedNatureSession State Machine', () => {
    it('transitions through idle, playing, paused, and completed states', async () => {
      const onComplete = vi.fn();
      const onClose = vi.fn();

      render(
        <GuidedNatureSession
          isOpen={true}
          onClose={onClose}
          onSessionComplete={onComplete}
        />
      );

      // Setup screen
      expect(screen.getByText(/The Whispering Forest/i)).toBeDefined();

      // Begin session
      const startBtn = screen.getByRole('button', { name: /Begin Nature Break/i });
      fireEvent.click(startBtn);

      // Active state
      expect(screen.getByText(/Segment 1 of 3/i)).toBeDefined();

      // Pause button
      const pauseBtn = screen.getByRole('button', { name: /Pause/i });
      fireEvent.click(pauseBtn);
      expect(screen.getByRole('button', { name: /Resume/i })).toBeDefined();

      // Next segment
      const nextBtn = screen.getByRole('button', { name: /Next →/i });
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Segment 2 of 3/i)).toBeDefined();

      // Complete session
      fireEvent.click(nextBtn); // To seg 3
      fireEvent.click(screen.getByRole('button', { name: /Complete/i })); // To completed

      expect(screen.getByText(/Session Complete!/i)).toBeDefined();
      expect(onComplete).toHaveBeenCalled();
    });

    it('cleans up resources on cancel or unmount', () => {
      const onClose = vi.fn();
      const { unmount } = render(
        <GuidedNatureSession isOpen={true} onClose={onClose} />
      );

      const closeBtn = screen.getByRole('button', { name: /Close Guided Nature Session/i });
      fireEvent.click(closeBtn);

      expect(onClose).toHaveBeenCalled();
      unmount();
    });
  });
});
