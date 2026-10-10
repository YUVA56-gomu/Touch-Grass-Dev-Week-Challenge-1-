import { AIProvider, AIMessage, AIContext, AIResponse } from './types';
import { MockAIProvider } from './MockAIProvider';

export class FastAPILLMAdapter implements AIProvider {
  name = 'FastAPI LLM Backend Gateway Adapter';
  isMock = false;
  private baseUrl: string;
  private fallbackProvider: MockAIProvider;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
    this.fallbackProvider = new MockAIProvider();
  }

  async sendMessage(prompt: string, history?: AIMessage[], context?: AIContext): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: 'local_session',
          message: prompt,
          user_context: {
            friend_name: context?.friendName,
            time_of_day: context?.timeOfDay,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        replyText: data.reply_text,
        expression: data.expression || 'happy',
        suggestedPrompts: data.suggested_prompts || [],
        audioNarrationUrl: data.audio_narration_url || null,
      };
    } catch (error) {
      console.warn('FastAPI backend gateway unavailable. Falling back to local MockAIProvider:', error);
      return this.fallbackProvider.sendMessage(prompt, history, context);
    }
  }
}
