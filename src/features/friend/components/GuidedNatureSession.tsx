import React, { useState, useEffect, useRef } from 'react';
import { GuidedSessionState, NatureStory, StorySegment } from '../types';
import { AudioEngine, AudioScene } from '../../../services/audio/AudioEngine';
import { VoiceService } from '../../../services/voice/VoiceService';
import { ElevenLabsVoiceService, defaultElevenLabsVoiceService } from '../../../services/voice/ElevenLabsVoiceService';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { Play, Pause, Square, Volume2, VolumeX, Trees, Wind, CloudRain, CheckCircle, Sparkles, X } from 'lucide-react';
import './GuidedNatureSession.css';

interface GuidedNatureSessionProps {
  isOpen: boolean;
  onClose: () => void;
  friendName?: string;
  onSessionComplete?: () => void;
  audioEngine?: AudioEngine;
  voiceService?: VoiceService;
  elevenLabsVoiceService?: ElevenLabsVoiceService;
}

const NATURE_STORIES: NatureStory[] = [
  {
    id: 'forest_break',
    title: 'The Whispering Forest',
    scene: 'forest',
    outdoorInvitation: '🌱 Feel inspired? Step outside for 5 minutes. Find a tree, feel the fresh air, and take three deep breaths!',
    segments: [
      {
        id: 1,
        title: 'Entering the Canopy',
        narrationText: "Let's take a peaceful break together. Imagine walking onto a soft dirt path leading into a sunlit forest. The air is cool, fresh, and smells of green pine needles.",
        durationSeconds: 15,
      },
      {
        id: 2,
        title: 'Breezy Pines',
        narrationText: "Look up at the high emerald branches swaying slowly in the wind. Sunlight filters down in golden rays, warming your shoulders. There is no rush right now.",
        durationSeconds: 15,
      },
      {
        id: 3,
        title: 'Rooted Ground',
        narrationText: "Feel your feet firmly resting on the ground. Like a strong tree, you are supported and grounded. Breathe in the clean forest air... and let all tension fade away.",
        durationSeconds: 15,
      },
    ],
  },
  {
    id: 'meadow_breeze',
    title: 'Sunlit Meadow Walk',
    scene: 'meadow',
    outdoorInvitation: '🌻 Step into your yard or balcony for a quick breather. Notice the temperature of the air against your skin!',
    segments: [
      {
        id: 1,
        title: 'Open Fields',
        narrationText: "Picture a wide, open green meadow stretching out under a clear blue sky. Wildflowers dance gently as a warm breeze sweeps across the grass.",
        durationSeconds: 15,
      },
      {
        id: 2,
        title: 'Resting in Sunshine',
        narrationText: "Sit comfortably in the soft grass. Feel the soothing warmth of the sun on your face and arms. Listen to the gentle rustle of leaves and distant bird song.",
        durationSeconds: 15,
      },
      {
        id: 3,
        title: 'Present Moment',
        narrationText: "Notice how simple and quiet this moment is. You don't need to answer any emails or check any screens. Just be here with the sky and grass.",
        durationSeconds: 15,
      },
    ],
  },
  {
    id: 'rain_haven',
    title: 'Peaceful Rain Haven',
    scene: 'rain',
    outdoorInvitation: '🌧️ Open a window or step onto a covered porch to listen to the real ambient sounds outside!',
    segments: [
      {
        id: 1,
        title: 'Sheltered Porch',
        narrationText: "Imagine sitting under a wooden porch shelter while a soft, steady rain falls onto the forest leaves around you.",
        durationSeconds: 15,
      },
      {
        id: 2,
        title: 'Rhythmic Drops',
        narrationText: "The rhythmic patter of raindrops washes away all the busyness of the day. Every drop refreshes the soil and cleanses the air.",
        durationSeconds: 15,
      },
      {
        id: 3,
        title: 'Renewed Calm',
        narrationText: "Take a deep breath of fresh rain-washed air. You feel calm, rested, and renewed.",
        durationSeconds: 15,
      },
    ],
  },
];

export const GuidedNatureSession: React.FC<GuidedNatureSessionProps> = ({
  isOpen,
  onClose,
  friendName = 'Sprout',
  onSessionComplete,
  audioEngine: propAudioEngine,
  voiceService: propVoiceService,
  elevenLabsVoiceService: propElevenLabsService,
}) => {
  const [sessionState, setSessionState] = useState<GuidedSessionState>('idle');
  const [selectedScene, setSelectedScene] = useState<AudioScene>('forest');
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  const localAudioEngineRef = useRef<AudioEngine | null>(null);
  const localVoiceServiceRef = useRef<VoiceService | null>(null);

  const audioEngine = propAudioEngine || localAudioEngineRef.current;
  const voiceService = propVoiceService || localVoiceServiceRef.current;
  const elevenLabsService = propElevenLabsService || defaultElevenLabsVoiceService;

  // Initialize services if props not passed
  useEffect(() => {
    if (!propAudioEngine && !localAudioEngineRef.current) {
      localAudioEngineRef.current = new AudioEngine();
    }
    if (!propVoiceService && !localVoiceServiceRef.current) {
      localVoiceServiceRef.current = new VoiceService();
    }

    return () => {
      // Cleanup on unmount
      if (localAudioEngineRef.current) {
        localAudioEngineRef.current.cleanup();
      }
      if (localVoiceServiceRef.current) {
        localVoiceServiceRef.current.stopSpeaking();
      }
      elevenLabsService.stopSpeaking();
    };
  }, [propAudioEngine, propVoiceService, elevenLabsService]);

  // Current Story Selection
  const currentStory = NATURE_STORIES.find((s) => s.scene === selectedScene) || NATURE_STORIES[0];
  const currentSegment: StorySegment = currentStory.segments[currentSegmentIndex] || currentStory.segments[0];

  // Handle Play Session
  const handleStartSession = () => {
    setSessionState('playing');
    setCurrentSegmentIndex(0);

    if (audioEngine) {
      audioEngine.setScene(selectedScene);
      audioEngine.setVolume(volume);
      audioEngine.play();
    }

    speakSegment(currentStory.segments[0]);
  };

  const speakSegment = (seg: StorySegment) => {
    const textToSpeak = `${friendName} says: ${seg.narrationText}`;
    elevenLabsService.speakText(
      textToSpeak,
      'guardian',
      undefined,
      undefined,
      () => {
        // Fallback to browser voice service
        if (voiceService && voiceService.isSynthesisSupported()) {
          voiceService.speak(textToSpeak);
        }
      }
    );
  };

  const handlePause = () => {
    setSessionState('paused');
    if (audioEngine) {
      audioEngine.pause();
    }
    if (voiceService) {
      voiceService.stopSpeaking();
    }
    elevenLabsService.stopSpeaking();
  };

  const handleResume = () => {
    setSessionState('playing');
    if (audioEngine) {
      audioEngine.play();
    }
    speakSegment(currentSegment);
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < currentStory.segments.length - 1) {
      const nextIdx = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIdx);
      if (sessionState === 'playing') {
        speakSegment(currentStory.segments[nextIdx]);
      }
    } else {
      handleComplete();
    }
  };

  const handlePrevSegment = () => {
    if (currentSegmentIndex > 0) {
      const prevIdx = currentSegmentIndex - 1;
      setCurrentSegmentIndex(prevIdx);
      if (sessionState === 'playing') {
        speakSegment(currentStory.segments[prevIdx]);
      }
    }
  };

  const handleComplete = () => {
    setSessionState('completed');
    if (audioEngine) {
      audioEngine.stop();
    }
    if (voiceService) {
      voiceService.stopSpeaking();
    }
    elevenLabsService.stopSpeaking();
    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  const handleStopAndCancel = () => {
    setSessionState('cancelled');
    if (audioEngine) {
      audioEngine.stop();
    }
    if (voiceService) {
      voiceService.stopSpeaking();
    }
    elevenLabsService.stopSpeaking();
    onClose();
  };

  const handleToggleMute = () => {
    if (audioEngine) {
      const muted = audioEngine.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioEngine) {
      audioEngine.setVolume(newVol);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="guided-session-overlay" role="dialog" aria-labelledby="session-dialog-title">
      <div className="guided-session-modal pixel-container">
        {/* Header */}
        <div className="guided-session-header">
          <div className="guided-session-header__title font-pixel">
            <Sparkles size={22} className="text-lime" />
            <h2 id="session-dialog-title">{currentStory.title}</h2>
          </div>
          <button
            className="guided-session-close-btn"
            onClick={handleStopAndCancel}
            aria-label="Close Guided Nature Session"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="guided-session-body">
          {sessionState === 'idle' && (
            <div className="session-setup">
              <p className="session-intro">
                Choose a peaceful nature environment for your guided break with <strong>{friendName}</strong>:
              </p>

              <div className="scene-picker-grid">
                <button
                  className={`scene-card ${selectedScene === 'forest' ? 'scene-card--active' : ''}`}
                  onClick={() => setSelectedScene('forest')}
                >
                  <Trees size={32} className="scene-card__icon" />
                  <span className="scene-card__name font-pixel">Forest Canopy</span>
                  <span className="scene-card__desc">Swaying pines & birdsong</span>
                </button>

                <button
                  className={`scene-card ${selectedScene === 'meadow' ? 'scene-card--active' : ''}`}
                  onClick={() => setSelectedScene('meadow')}
                >
                  <Wind size={32} className="scene-card__icon" />
                  <span className="scene-card__name font-pixel">Sunlit Meadow</span>
                  <span className="scene-card__desc">Gentle breeze & open sky</span>
                </button>

                <button
                  className={`scene-card ${selectedScene === 'rain' ? 'scene-card--active' : ''}`}
                  onClick={() => setSelectedScene('rain')}
                >
                  <CloudRain size={32} className="scene-card__icon" />
                  <span className="scene-card__name font-pixel">Rain Haven</span>
                  <span className="scene-card__desc">Soft rainfall & quiet calm</span>
                </button>
              </div>

              <div className="session-setup__actions">
                <PixelButton variant="primary" size="lg" icon={<Play size={20} />} onClick={handleStartSession}>
                  Begin Nature Break
                </PixelButton>
              </div>
            </div>
          )}

          {(sessionState === 'playing' || sessionState === 'paused') && (
            <div className="session-active">
              {/* Segment Progress Badge */}
              <div className="segment-indicator font-pixel">
                Segment {currentSegmentIndex + 1} of {currentStory.segments.length}: {currentSegment.title}
              </div>

              {/* Narration Segment Card */}
              <PixelCard title={`${friendName}'s Guidance`} className="narration-card">
                <p className="narration-text">"{currentSegment.narrationText}"</p>
              </PixelCard>

              {/* Ambience & Volume Controls */}
              <div className="audio-controls-bar">
                <div className="audio-controls-left">
                  <button className="audio-control-btn" onClick={handleToggleMute} aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label="Ambience Volume"
                  />
                </div>

                <div className="audio-controls-center">
                  <PixelButton
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevSegment}
                    disabled={currentSegmentIndex === 0}
                  >
                    &larr; Prev
                  </PixelButton>

                  {sessionState === 'playing' ? (
                    <PixelButton variant="accent" size="md" icon={<Pause size={18} />} onClick={handlePause}>
                      Pause
                    </PixelButton>
                  ) : (
                    <PixelButton variant="primary" size="md" icon={<Play size={18} />} onClick={handleResume}>
                      Resume
                    </PixelButton>
                  )}

                  <PixelButton variant="ghost" size="sm" onClick={handleNextSegment}>
                    {currentSegmentIndex < currentStory.segments.length - 1 ? 'Next \u2192' : 'Complete'}
                  </PixelButton>
                </div>
              </div>

              <div className="session-cancel-action">
                <PixelButton variant="ghost" size="sm" icon={<Square size={16} />} onClick={handleStopAndCancel}>
                  End Experience
                </PixelButton>
              </div>
            </div>
          )}

          {sessionState === 'completed' && (
            <div className="session-completed">
              <div className="session-completed__icon font-pixel">
                <CheckCircle size={48} className="text-lime" />
                <h3>Session Complete!</h3>
              </div>

              <p className="session-completed__invitation">
                {currentStory.outdoorInvitation}
              </p>

              <div className="session-completed__actions">
                <PixelButton variant="primary" onClick={handleStopAndCancel}>
                  Return to Home
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
