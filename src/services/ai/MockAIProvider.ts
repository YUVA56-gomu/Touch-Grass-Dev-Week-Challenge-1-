import { AIProvider, AIMessage, AIContext, AIResponse } from './types';
import { MascotExpression } from '../../types';

export class MockAIProvider implements AIProvider {
  name = 'Development Mock AI Spirit Provider';
  isMock = true;
  private isCancelled = false;
  private shouldFailNext = false;

  public setShouldFailNext(fail: boolean) {
    this.shouldFailNext = fail;
  }

  public cancelRequest(): void {
    this.isCancelled = true;
  }

  async sendMessage(prompt: string, _history?: AIMessage[], context?: AIContext): Promise<AIResponse> {
    this.isCancelled = false;
    const friendName = context?.friendName || 'Sprout';

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (this.isCancelled) {
      throw new Error('AI request was cancelled by the user.');
    }

    if (this.shouldFailNext) {
      this.shouldFailNext = false;
      throw new Error('Simulated network error. Please try again in a moment!');
    }

    const lower = prompt.toLowerCase();
    let replyText = `I hear you, friend! Taking a moment to connect with nature always helps us find balance.`;
    let expression: MascotExpression = 'happy';
    let suggestedPrompts = [
      'Tell me a forest story',
      'How can I relax right now?',
      'Why is touching grass good for me?'
    ];

    if (lower.includes('story') || lower.includes('forest') || lower.includes('imagine')) {
      replyText = `Imagine standing at the edge of an ancient forest. Sunlight filters through the high emerald canopy, casting soft golden patches on green moss below. The air is cool, fresh, and smells of pine. You take a slow, deep breath...`;
      expression = 'excited';
      suggestedPrompts = ['Tell me more', 'Let\'s do a guided break', 'Thank you, Sprout!'];
    } else if (lower.includes('relax') || lower.includes('breath') || lower.includes('stress') || lower.includes('tired')) {
      replyText = `Let's slow down together. Unclench your jaw, drop your shoulders, and feel your feet resting firmly on the floor. Take a 4-second breath in... and let it out gently. You're doing just fine.`;
      expression = 'resting';
      suggestedPrompts = ['Start a guided nature session', 'What else can we do?', 'Tell me a story'];
    } else if (lower.includes('grass') || lower.includes('outdoor') || lower.includes('nature') || lower.includes('why')) {
      replyText = `Stepping outdoors grounds our senses! Looking at green plants lowers stress hormones, while fresh air and natural sunlight help reset our sleep rhythm and brighten our mood.`;
      expression = 'happy';
      suggestedPrompts = ['Log an outdoor visit', 'Where should I go?', 'Let\'s relax'];
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      replyText = `Hello there! I'm ${friendName}, your nature spirit companion. How are you feeling today? Would you like to take a quick nature break with me?`;
      expression = 'waving';
    }

    return {
      replyText,
      expression,
      suggestedPrompts,
      audioNarrationUrl: null,
    };
  }
}
