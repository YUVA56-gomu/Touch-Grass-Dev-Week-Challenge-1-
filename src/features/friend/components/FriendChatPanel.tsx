import React, { useState, useEffect, useRef } from 'react';
import { AIMessage } from '../../../services/ai/types';
import { AIProvider } from '../../../services/ai/types';
import { MockAIProvider } from '../../../services/ai/MockAIProvider';
import { VoiceService } from '../../../services/voice/VoiceService';
import { MascotDisplay } from '../../../components/mascot/MascotDisplay';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MascotExpression } from '../../../types';
import { Send, Mic, MicOff, VolumeX, Sparkles, Edit2, Check, RefreshCw } from 'lucide-react';
import './FriendChatPanel.css';

interface FriendChatPanelProps {
  aiProvider?: AIProvider;
  voiceService?: VoiceService;
  onLaunchGuidedSession?: () => void;
}

export const FriendChatPanel: React.FC<FriendChatPanelProps> = ({
  aiProvider: propAiProvider,
  voiceService: propVoiceService,
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
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Mascot Expression
  const [mascotExpression, setMascotExpression] = useState<MascotExpression>('waving');

  // Service Refs
  const defaultAiProviderRef = useRef<AIProvider | null>(null);
  const defaultVoiceServiceRef = useRef<VoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const aiProvider = propAiProvider || defaultAiProviderRef.current || new MockAIProvider();
  const voiceService = propVoiceService || defaultVoiceServiceRef.current || new VoiceService();

  useEffect(() => {
    if (!propAiProvider && !defaultAiProviderRef.current) {
      defaultAiProviderRef.current = new MockAIProvider();
    }
    if (!propVoiceService && !defaultVoiceServiceRef.current) {
      defaultVoiceServiceRef.current = new VoiceService();
    }
  }, [propAiProvider, propVoiceService]);

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

  // Save Friend Name
  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Sprout';
    setFriendName(trimmed);
    localStorage.setItem('touch_grass_friend_name', trimmed);
    setIsEditingName(false);
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

      const assistantMsg: AIMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.replyText,
        timestamp: Date.now(),
        expression: response.expression,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
      setMascotExpression(response.expression || 'happy');

      // Auto-speak response if voice service available
      if (voiceService && voiceService.isSynthesisSupported()) {
        setIsSpeaking(true);
        voiceService.speak(
          response.replyText,
          () => {
            setIsSpeaking(false);
            setMascotExpression('happy');
          },
          () => {
            setIsSpeaking(false);
            setMascotExpression('happy');
          }
        );
      }
    } catch (err: any) {
      setIsThinking(false);
      setMascotExpression('resting');
      setErrorMessage(err.message || 'Unable to connect to your nature spirit. Please try again!');
    }
  };

  // Toggle Voice Recognition
  const handleToggleMic = () => {
    if (!voiceService || !voiceService.isRecognitionSupported()) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setMascotExpression('happy');
    } else {
      setIsListening(true);
      setMascotExpression('thinking');
      setErrorMessage(null);

      voiceService.startListening(
        (transcript) => {
          setIsListening(false);
          if (transcript) {
            handleSendMessage(transcript);
          }
        },
        (err) => {
          setIsListening(false);
          setMascotExpression('happy');
          setErrorMessage(`Mic error: ${err}`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // Stop Active Speech Synthesis
  const handleStopSpeaking = () => {
    if (voiceService) {
      voiceService.stopSpeaking();
    }
    setIsSpeaking(false);
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

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <PixelButton variant="accent" size="sm" icon={<VolumeX size={16} />} onClick={handleStopSpeaking}>
            Stop Voice
          </PixelButton>
        )}
      </div>

      {/* Mascot Centerpiece */}
      <div className="chat-mascot-section">
        <MascotDisplay
          size="md"
          expression={mascotExpression}
          showSpeechBubble={false}
        />
        <div className="mascot-status-indicator font-pixel">
          {isListening && <span className="status-badge status-listening">🎙️ Listening...</span>}
          {isThinking && <span className="status-badge status-thinking">🌱 Thinking...</span>}
          {isSpeaking && <span className="status-badge status-speaking">🔊 Speaking...</span>}
          {!isListening && !isThinking && !isSpeaking && (
            <span className="status-badge status-idle">✨ Active & Ready</span>
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
              {msg.sender === 'user' ? 'You' : friendName}
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
          disabled={!voiceService.isRecognitionSupported() || isThinking}
          title={
            voiceService.isRecognitionSupported()
              ? isListening
                ? 'Stop listening'
                : 'Click to speak'
              : 'Speech recognition not supported in this browser'
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
          disabled={isThinking}
        />

        {/* Send Button */}
        <PixelButton
          variant="primary"
          size="md"
          type="submit"
          disabled={!inputPrompt.trim() || isThinking}
          icon={isThinking ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
        >
          Send
        </PixelButton>
      </form>
    </div>
  );
};
