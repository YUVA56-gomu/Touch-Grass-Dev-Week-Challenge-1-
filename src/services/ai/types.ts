import { MascotExpression } from '../../types';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  expression?: MascotExpression;
}

export interface AIContext {
  friendName?: string;
  timeOfDay?: string;
  recentTopics?: string[];
}

export interface AIResponse {
  replyText: string;
  expression: MascotExpression;
  suggestedPrompts?: string[];
  audioNarrationUrl?: string | null;
}

export interface StorySegment {
  id: number;
  title: string;
  text: string;
  durationSeconds: number;
}

export interface GuidedNatureStory {
  id: string;
  title: string;
  scene: 'forest' | 'meadow' | 'rain';
  segments: StorySegment[];
  outdoorInvitation: string;
}

export interface AIProvider {
  name: string;
  isMock: boolean;
  sendMessage(prompt: string, history?: AIMessage[], context?: AIContext): Promise<AIResponse>;
  cancelRequest?(): void;
}
