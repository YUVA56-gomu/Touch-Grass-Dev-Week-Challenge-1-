import React, { useState, useEffect, useRef } from 'react';
import { AIProvider, AIMessage } from '../../../services/ai/types';
import { VoiceService } from '../../../services/voice/VoiceService';
import { ElevenLabsVoiceService, defaultElevenLabsVoiceService, VoiceProfileItem } from '../../../services/voice/ElevenLabsVoiceService';
import { FastAPILLMAdapter } from '../../../services/ai/FastAPILLMAdapter';
import { MascotDisplay } from '../../../components/mascot/MascotDisplay';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MascotExpression } from '../../../types';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Edit2, Check, RefreshCw, XCircle, Radio } from 'lucide-react';
import './FriendChatPanel.css';

interface FriendChatPanelProps {
  aiProvider?: AIProvider;
  voiceService?: VoiceService;
  elevenLabsVoiceService?: ElevenLabsVoiceService;
  onLaunchGuidedSession?: () => void;
}

export const FriendChatPanel: React.FC<FriendChatPanelProps> = ({
  aiProvider: propAiProvider,
  voiceService: propVoiceService,
  elevenLabsVoiceService: propElevenLabsService,
  onLaunchGuidedSession,
}) => {
  // Local Settings & State
  const [friendName, setFriendName] = useState<string>(() => {
    return localStorage.getItem('touch_grass_friend_name') || 'Sprout';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(friendName);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeProviderMode, setActiveProviderMode] = useState<string>('FastAPI Gateway / Local Fallback');

  // ElevenLabs Voice Profiles & State
  const [elevenLabsConfigured, setElevenLabsConfigured] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceProfileItem[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('sprout');

  // Active Mascot Expression
  const [mascotExpression, setMascotExpression] = useState<MascotExpression>('waving');

  // Service Refs
  const defaultAiProviderRef = useRef<AIProvider | null>(null);
  const defaultVoiceServiceRef = useRef<VoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const aiProvider = propAiProvider || defaultAiProviderRef.current || new FastAPILLMAdapter();
  const voiceService = propVoiceService || defaultVoiceServiceRef.current || new VoiceService();
  const elevenLabsService = propElevenLabsService || defaultElevenLabsVoiceService;

  useEffect(() => {
    if (!propAiProvider && !defaultAiProviderRef.current) {
      defaultAiProviderRef.current = new FastAPILLMAdapter();
    }
    if (!propVoiceService && !defaultVoiceServiceRef.current) {
      defaultVoiceServiceRef.current = new VoiceService();
    }
  }, [propAiProvider, propVoiceService]);

  // Load ElevenLabs voices
  useEffect(() => {
    elevenLabsService.fetchVoices().then((res) => {
      setElevenLabsConfigured(res.configured);
      if (res.voices && res.voices.length > 0) {
        setAvailableVoices(res.voices);
      }
    });
  }, [elevenLabsService]);

  // Initial Welcome Greeting
  useEffect(() => {
    const welcomeMsg: AIMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello there! I'm ${friendName}, your nature spirit friend. How are you feeling today? Take a deep breath and let me know!`,
      timestamp: Date.now(),
      expression: 'waving',
    };
    setMessages([welcomeMsg]);
  }, [friendName]);

  // Scroll to bottom on message
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      elevenLabsService.stopSpeaking();
      elevenLabsService.cancelRecording();
      voiceService.stopSpeaking();
    };
  }, [elevenLabsService, voiceService]);

  // Save Friend Name
  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Sprout';
    setFriendName(trimmed);
    localStorage.setItem('touch_grass_friend_name', trimmed);
    setIsEditingName(false);
  };

  // Speak specific message text
  const handleSpeakMessage = async (msgId: string, text: string) => {
    if (isSpeaking && speakingMsgId === msgId) {
      handleStopSpeaking();
      return;
    }

    handleStopSpeaking();
    setIsSpeaking(true);
    setSpeakingMsgId(msgId);
    setMascotExpression('excited');

    if (elevenLabsConfigured) {
      const success = await elevenLabsService.speakText(
        text,
        selectedVoice,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
          setMascotExpression('happy');
        },
        (err) => {
          console.warn('ElevenLabs speech generation error:', err);
          setErrorMessage(`ElevenLabs Voice Error: ${err}`);
          if (voiceService && voiceService.isSynthesisSupported()) {
            voiceService.speak(
              text,
              () => {
                setIsSpeaking(false);
                setSpeakingMsgId(null);
                setMascotExpression('happy');
              },
              (synthErr) => {
                setIsSpeaking(false);
                setSpeakingMsgId(null);
                setMascotExpression('resting');
                setErrorMessage(`Voice Error: ${synthErr}`);
              }
            );
          } else {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            setMascotExpression('resting');
          }
        }
      );
      if (!success && (!voiceService || !voiceService.isSynthesisSupported())) {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      }
    } else if (voiceService && voiceService.isSynthesisSupported()) {
      voiceService.speak(
        text,
        () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
          setMascotExpression('happy');
        },
        (err) => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
          setMascotExpression('happy');
          setErrorMessage(err);
        }
      );
    } else {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      setErrorMessage('Speech synthesis is not supported or configured.');
    }
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isThinking) return;

    setErrorMessage(null);
    setInputPrompt('');

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setMascotExpression('thinking');

    try {
      const response = await aiProvider.sendMessage(text, messages, {
        friendName,
      });

      if (response.providerName) {
        setActiveProviderMode(response.providerName);
      } else if (response.isMock) {
        setActiveProviderMode('Mock Nature Spirit (Fallback)');
      } else {
        setActiveProviderMode('FastAPI Gateway (Real LLM)');
      }

      const asstId = `asst-${Date.now()}`;
      const assistantMsg: AIMessage = {
        id: asstId,
        sender: 'assistant',
        text: response.replyText,
        timestamp: Date.now(),
        expression: response.expression,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
      setMascotExpression(response.expression || 'happy');

      // Auto-speak response if enabled
      if (autoSpeak) {
        handleSpeakMessage(asstId, response.replyText);
      }
    } catch (err: any) {
      setIsThinking(false);
      setMascotExpression('resting');
      setErrorMessage(err.message || 'Unable to connect to your nature spirit. Please try again!');
    }
  };

  // Recording & Transcription Logic
  const handleToggleMic = async () => {
    if (isListening) {
      if (elevenLabsConfigured) {
        // Stop recording and transcribe via ElevenLabs
        try {
          setIsListening(false);
          setIsTranscribing(true);
          setMascotExpression('thinking');

          const audioBlob = await elevenLabsService.stopRecording();
          const transcript = await elevenLabsService.transcribeAudioBlob(audioBlob);
          setIsTranscribing(false);
          setMascotExpression('happy');
          if (transcript.trim()) {
            setInputPrompt(transcript);
          } else {
            setErrorMessage('No speech detected in recording.');
          }
        } catch (err: any) {
          setIsListening(false);
          setIsTranscribing(false);
          setMascotExpression('happy');
          setErrorMessage(err.message || 'Failed to record/transcribe audio.');
        }
      } else {
        // Browser SpeechRecognition is active
        if (voiceService) {
          voiceService.stopListening();
        }
        setIsListening(false);
        setIsTranscribing(false);
        setMascotExpression('happy');
      }
    } else {
      // Start recording
      setErrorMessage(null);
      if (elevenLabsConfigured) {
        try {
          await elevenLabsService.startRecording();
          setIsListening(true);
          setMascotExpression('thinking');
          return;
        } catch (err: any) {
          console.warn('ElevenLabs recording start failed, falling back to browser speech recognition:', err);
        }
      }

      // Browser Web Speech API fallback
      if (voiceService && voiceService.isRecognitionSupported()) {
        setIsListening(true);
        setMascotExpression('thinking');
        const started = voiceService.startListening(
          (transcript) => {
            setIsListening(false);
            setMascotExpression('happy');
            if (transcript) setInputPrompt(transcript);
          },
          (recErr) => {
            setIsListening(false);
            setMascotExpression('happy');
            setErrorMessage(`Mic error: ${recErr}`);
          },
          () => setIsListening(false)
        );
        if (!started) {
          setIsListening(false);
          setMascotExpression('happy');
        }
      } else {
        setErrorMessage('Speech recognition is not supported in this browser.');
      }
    }
  };

  const handleCancelRecording = () => {
    elevenLabsService.cancelRecording();
    if (voiceService) voiceService.stopListening();
    setIsListening(false);
    setIsTranscribing(false);
    setMascotExpression('happy');
  };

  // Stop Active Speech Synthesis
  const handleStopSpeaking = () => {
    elevenLabsService.stopSpeaking();
    if (voiceService) voiceService.stopSpeaking();
    setIsSpeaking(false);
    setSpeakingMsgId(null);
    setMascotExpression('happy');
  };

  return (
    <div className="friend-chat-panel">
      {/* Top Header & Friend Name Customizer */}
      <div className="chat-panel-header">
        <div className="friend-name-bar">
          <span className="friend-title-label font-pixel">YOUR NATURE SPIRIT:</span>
          {isEditingName ? (
            <div className="friend-name-edit">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                className="friend-name-input font-pixel"
                autoFocus
              />
              <button className="icon-btn-confirm" onClick={handleSaveName} aria-label="Save Friend Name">
                <Check size={18} />
              </button>
            </div>
          ) : (
            <div className="friend-name-display">
              <span className="friend-name-text font-pixel">{friendName}</span>
              <button
                className="icon-btn-edit"
                onClick={() => {
                  setNameInput(friendName);
                  setIsEditingName(true);
                }}
                aria-label="Edit Friend Name"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Voice Controls Header Controls */}
        <div className="chat-header-voice-controls">
          {elevenLabsConfigured && availableVoices.length > 0 && (
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="voice-select-dropdown font-pixel"
              title="Select ElevenLabs Voice Profile"
              aria-label="Select Voice Profile"
            >
              {availableVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  🎙️ {v.name}
                </option>
              ))}
            </select>
          )}

          <label className="auto-speak-toggle font-pixel" title="Auto-speak AI responses when received">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            <span>Auto-Speak</span>
          </label>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <PixelButton variant="accent" size="sm" icon={<VolumeX size={16} />} onClick={handleStopSpeaking}>
              Stop Voice
            </PixelButton>
          )}
        </div>
      </div>

      {/* Mascot Centerpiece */}
      <div className="chat-mascot-section">
        <MascotDisplay
          size="md"
          expression={mascotExpression}
          showSpeechBubble={false}
        />
        <div className="mascot-status-indicator font-pixel">
          {isListening && (
            <span className="status-badge status-listening">
              🎙️ Recording...
              <button className="cancel-rec-btn" onClick={handleCancelRecording} title="Cancel Recording">
                <XCircle size={14} />
              </button>
            </span>
          )}
          {isTranscribing && <span className="status-badge status-thinking">⏳ Transcribing Audio...</span>}
          {isThinking && <span className="status-badge status-thinking">🌱 Thinking...</span>}
          {isSpeaking && <span className="status-badge status-speaking">🔊 Speaking ({selectedVoice === 'sprout' ? 'Sprout' : 'Forest Guardian'})...</span>}
          {!isListening && !isTranscribing && !isThinking && !isSpeaking && (
            <span className="status-badge status-idle">
              <Radio size={12} className="inline mr-1 text-lime" />
              Active ({activeProviderMode}) {elevenLabsConfigured ? '• 🔊 ElevenLabs Ready' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Message History Window */}
      <div className="chat-messages-container" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-wrapper ${
              msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
            }`}
          >
            <div className="chat-bubble-sender font-pixel">
              <span>{msg.sender === 'user' ? 'You' : friendName}</span>
              {msg.sender === 'assistant' && (
                <button
                  className={`msg-speak-btn ${speakingMsgId === msg.id ? 'msg-speak-btn--active' : ''}`}
                  onClick={() => handleSpeakMessage(msg.id, msg.text)}
                  aria-label={speakingMsgId === msg.id ? 'Stop audio' : 'Speak reply'}
                  title={speakingMsgId === msg.id ? 'Stop audio' : 'Speak reply with ElevenLabs'}
                >
                  {speakingMsgId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}
            </div>
            <div className="chat-bubble-content">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="chat-bubble-wrapper chat-bubble-assistant">
            <div className="chat-bubble-sender font-pixel">{friendName}</div>
            <div className="chat-bubble-content thinking-dots font-pixel">
              <span>✦ Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="chat-error-banner font-pixel">
          <span>⚠️ {errorMessage}</span>
          <button className="chat-error-dismiss" onClick={() => setErrorMessage(null)}>Dismiss</button>
        </div>
      )}

      {/* Suggested Prompts & Guided Break Action */}
      <div className="chat-quick-actions">
        <div className="suggested-prompts">
          <button
            className="prompt-chip font-pixel"
            onClick={() => handleSendMessage('Tell me a forest story')}
          >
            🌲 Forest Story
          </button>
          <button
            className="prompt-chip font-pixel"
            onClick={() => handleSendMessage('How can I relax right now?')}
          >
            🧘 Relax Tip
          </button>
          <button
            className="prompt-chip font-pixel"
            onClick={() => handleSendMessage('Why is touching grass good for me?')}
          >
            🌱 Why Touch Grass?
          </button>
        </div>

        {onLaunchGuidedSession && (
          <PixelButton
            variant="accent"
            size="md"
            icon={<Sparkles size={18} />}
            onClick={onLaunchGuidedSession}
            className="launch-guided-btn"
          >
            Start Guided Nature Session
          </PixelButton>
        )}
      </div>

      {/* Input Control Box */}
      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        {/* Mic Button */}
        <button
          type="button"
          className={`chat-mic-btn ${isListening ? 'chat-mic-btn--active' : ''}`}
          onClick={handleToggleMic}
          disabled={isThinking || isTranscribing}
          title={
            isListening
              ? 'Click to stop recording and transcribe'
              : 'Click to record voice prompt'
          }
          aria-label="Microphone input"
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Talk to ${friendName}...`}
          className="chat-text-input"
          disabled={isThinking || isTranscribing}
        />

        {/* Send Button */}
        <PixelButton
          variant="primary"
          size="md"
          type="submit"
          disabled={!inputPrompt.trim() || isThinking || isTranscribing}
          icon={isThinking ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
        >
          Send
        </PixelButton>
      </form>
    </div>
  );
};

