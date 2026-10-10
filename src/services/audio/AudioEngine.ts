// Reusable Nature Ambient Audio Engine with Web Audio API Procedural Synthesis Fallback

export type AudioScene = 'forest' | 'meadow' | 'rain';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private currentVolume = 0.5;
  private currentScene: AudioScene = 'forest';

  // Procedural Web Audio Nodes
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;

  private isWebAudioSupported(): boolean {
    return typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
  }

  private initAudioContext(): void {
    if (!this.audioContext && this.isWebAudioSupported()) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
  }

  public getScene(): AudioScene {
    return this.currentScene;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setScene(scene: AudioScene): void {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
    }
    this.currentScene = scene;
    if (wasPlaying) {
      this.play();
    }
  }

  public play(): boolean {
    if (!this.isWebAudioSupported()) {
      console.warn('Web Audio API is not supported in this browser environment.');
      return false;
    }

    this.initAudioContext();

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.isPlaying) {
      return true;
    }

    try {
      this.startProceduralAmbience(this.currentScene);
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn('AudioEngine play error:', err);
      this.isPlaying = false;
      return false;
    }
  }

  public pause(): void {
    if (this.isPlaying) {
      this.stopProceduralAmbience();
      this.isPlaying = false;
    }
  }

  public stop(): void {
    this.pause();
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.audioContext) {
      const targetGain = this.isMuted ? 0 : this.currentVolume * 0.15; // Kept gentle
      this.gainNode.gain.setValueAtTime(targetGain, this.audioContext.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.currentVolume);
    return this.isMuted;
  }

  public cleanup(): void {
    this.stop();
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        // ignore
      }
      this.audioContext = null;
    }
  }

  /* Procedural Synthesis for Forest, Meadow, Rain Tones */
  private startProceduralAmbience(scene: AudioScene): void {
    if (!this.audioContext) return;

    this.stopProceduralAmbience();

    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate Pink Noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter configuration based on scene
    this.filterNode = this.audioContext.createBiquadFilter();
    if (scene === 'rain') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 800; // Soft rainfall frequency
    } else if (scene === 'meadow') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = 1200; // Gentle wind frequency
    } else {
      // Forest
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 500; // Rustling leaves frequency
    }

    this.gainNode = this.audioContext.createGain();
    const initialGain = this.isMuted ? 0 : this.currentVolume * 0.15;
    this.gainNode.gain.setValueAtTime(initialGain, this.audioContext.currentTime);

    whiteNoise.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
  }

  private stopProceduralAmbience(): void {
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
        this.noiseNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.noiseNode = null;
    }
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}
