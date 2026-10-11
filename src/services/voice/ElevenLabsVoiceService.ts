export interface VoiceProfileItem {
  id: string;
  name: string;
  description: string;
}

export class ElevenLabsVoiceService {
  private baseUrl: string;
  private activeAudio: HTMLAudioElement | null = null;
  private activeBlobUrl: string | null = null;
  private isSpeaking = false;

  constructor(baseUrl?: string) {
    const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_AI_BACKEND_URL as string) : undefined;
    this.baseUrl = baseUrl || envUrl || 'http://127.0.0.1:8000/api/v1';
  }

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStream: MediaStream | null = null;

  public async fetchVoices(): Promise<{ configured: boolean; voices: VoiceProfileItem[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/voices`);
      if (!res.ok) return { configured: false, voices: [] };
      return await res.json();
    } catch (e) {
      return { configured: false, voices: [] };
    }
  }

  public async speakText(
    text: string,
    voiceProfile = 'sprout',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): Promise<boolean> {
    this.stopSpeaking();

    try {
      const res = await fetch(`${this.baseUrl}/voice/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: voiceProfile }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Speech generation failed' }));
        const errMsg = errorData.detail || `HTTP error ${res.status}`;
        console.error('ElevenLabs speech generation API failed:', errMsg);
        throw new Error(errMsg);
      }

      const audioBlob = await res.blob();
      this.activeBlobUrl = URL.createObjectURL(audioBlob);

      this.activeAudio = new Audio(this.activeBlobUrl);
      this.isSpeaking = true;

      if (onStart) onStart();

      this.activeAudio.onended = () => {
        this.cleanupAudio();
        if (onEnd) onEnd();
      };

      this.activeAudio.onerror = (e) => {
        console.error('HTMLAudioElement playback error:', e);
        this.cleanupAudio();
        if (onError) onError('Audio playback error in browser media element.');
      };

      await this.activeAudio.play();
      return true;
    } catch (err: any) {
      console.error('ElevenLabs speakText error:', err.message || err);
      this.cleanupAudio();
      if (onError) onError(err.message || 'ElevenLabs speech synthesis failed');
      return false;
    }
  }

  public async startRecording(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported in this browser.');
    }
    this.cancelRecording();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recordingStream = stream;
    this.audioChunks = [];
    const mimeType = typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };
    this.mediaRecorder.start();
    return true;
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('No active recording'));
      }
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        this.cleanupRecordingStream();
        resolve(audioBlob);
      };
      this.mediaRecorder.stop();
    });
  }

  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.onstop = null;
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        // ignore
      }
    }
    this.cleanupRecordingStream();
  }

  private cleanupRecordingStream(): void {
    if (this.recordingStream) {
      this.recordingStream.getTracks().forEach((track) => track.stop());
      this.recordingStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  public async transcribeAudioBlob(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    const res = await fetch(`${this.baseUrl}/voice/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Transcription failed' }));
      throw new Error(errorData.detail || 'Failed to transcribe audio');
    }

    const data = await res.json();
    return data.text || '';
  }

  public stopSpeaking(): void {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.cleanupAudio();
  }

  private cleanupAudio(): void {
    this.isSpeaking = false;
    if (this.activeBlobUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      try {
        URL.revokeObjectURL(this.activeBlobUrl);
      } catch (e) {
        // ignore
      }
    }
    this.activeBlobUrl = null;
    this.activeAudio = null;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const defaultElevenLabsVoiceService = new ElevenLabsVoiceService();
