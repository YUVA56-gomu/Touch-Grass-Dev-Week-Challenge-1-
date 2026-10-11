import { AIProvider, AIMessage, AIContext, AIResponse } from './types';
import { MockAIProvider } from './MockAIProvider';

export class FastAPILLMAdapter implements AIProvider {
  name = 'FastAPI Gateway (Real LLM)';
  isMock = false;
  private baseUrl: string;
  private fallbackProvider: MockAIProvider;
  private activeAbortController: AbortController | null = null;

  constructor(baseUrl?: string) {
    const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_AI_BACKEND_URL as string) : undefined;
    this.baseUrl = baseUrl || envUrl || 'http://127.0.0.1:8000/api/v1';
    this.fallbackProvider = new MockAIProvider();
  }

  cancelRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
  }

  async sendMessage(prompt: string, history?: AIMessage[], context?: AIContext): Promise<AIResponse> {
    this.cancelRequest();
    this.activeAbortController = new AbortController();

    try {
      const timeoutId = setTimeout(() => {
        if (this.activeAbortController) {
          this.activeAbortController.abort();
        }
      }, 10000);

      const response = await fetch(`${this.baseUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: this.activeAbortController.signal,
        body: JSON.stringify({
          session_id: 'local_session',
          message: prompt,
          history: history?.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
          user_context: {
            friend_name: context?.friendName,
            time_of_day: context?.timeOfDay,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        replyText: data.reply_text,
        expression: data.expression || 'happy',
        suggestedPrompts: data.suggested_prompts || [],
        audioNarrationUrl: data.audio_narration_url || null,
        isMock: data.is_mock ?? false,
        providerName: data.is_mock ? 'Mock Nature Spirit (Fallback)' : 'FastAPI Gateway (Real LLM)',
      };
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        console.warn('FastAPI LLM request cancelled or timed out. Falling back to local MockAIProvider.');
      } else {
        console.warn('FastAPI backend gateway unavailable. Falling back to local MockAIProvider:', error);
      }
      const fallbackRes = await this.fallbackProvider.sendMessage(prompt, history, context);
      return {
        ...fallbackRes,
        isMock: true,
        providerName: 'Mock Nature Spirit (Offline Fallback)',
      };
    } finally {
      this.activeAbortController = null;
    }
  }
}
