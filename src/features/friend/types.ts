import { AudioScene } from '../../services/audio/AudioEngine';

export type GuidedSessionState =
  | 'idle'
  | 'preparing'
  | 'playing'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'error';

export interface StorySegment {
  id: number;
  title: string;
  narrationText: string;
  durationSeconds: number;
}

export interface NatureStory {
  id: string;
  title: string;
  scene: AudioScene;
  segments: StorySegment[];
  outdoorInvitation: string;
}

export interface FriendUserSettings {
  friendName: string;
  volume: number;
  isMuted: boolean;
  selectedScene: AudioScene;
}
