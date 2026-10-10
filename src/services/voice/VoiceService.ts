// Voice Service Abstraction for Speech Recognition & Synthesis

export interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class VoiceService {
  private isListening = false;
  private isSpeaking = false;
  private recognition: any = null;

  constructor() {
    const win = (typeof window !== 'undefined' ? window : {}) as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
        this.recognition = null;
      }
    }
  }

  public isRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  public isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isRecognitionSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.isListening = true;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        this.isListening = false;
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false;
        if (onError) onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (onError) onError(err.message || 'Failed to start microphone listening');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public speak(
    text: string,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isSynthesisSupported()) {
      if (onError) onError('Speech synthesis is not supported in this browser.');
      return false;
    }

    // Stop any existing speech
    this.stopSpeaking();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Gentle pace
      utterance.pitch = 1.1; // Friendly spirit pitch

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        if (onError) onError(event.error || 'Speech synthesis error');
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      this.isSpeaking = false;
      if (onError) onError(err.message || 'Failed to synthesize speech');
      return false;
    }
  }

  public stopSpeaking(): void {
    if (this.isSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      this.isSpeaking = false;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
