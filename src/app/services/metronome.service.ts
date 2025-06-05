import { Injectable, signal, computed, effect } from '@angular/core';
import { AudioService } from './audio.service';
import { MetronomeState } from '../models/metronome.types';

@Injectable({
  providedIn: 'root'
})
export class MetronomeService {
  private metronomeInterval: any = null;

  readonly currentTempo = signal<number>(120);
  readonly isPlaying = signal<boolean>(false);

  readonly state = computed<MetronomeState>(() => ({
    currentTempo: this.currentTempo(),
    isPlaying: this.isPlaying(),
    volume: this.audioService.volume()
  }));

  constructor(private audioService: AudioService) {
    // Ефект для оновлення метронома при зміні темпу
    effect(() => {
      if (this.isPlaying()) {
        this.restartMetronome();
      }
    });
  }

  async toggle(): Promise<void> {
    if (this.isPlaying()) {
      this.stop();
    } else {
      await this.start();
    }
  }

  async start(): Promise<void> {
    await this.audioService.ensureAudioContext();

    this.isPlaying.set(true);
    const interval = 60000 / this.currentTempo();

    this.metronomeInterval = setInterval(() => {
      this.audioService.playClick();
    }, interval);

    // Відтворити перший удар відразу
    this.audioService.playClick();
  }

  stop(): void {
    this.isPlaying.set(false);
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }

  private restartMetronome(): void {
    if (this.isPlaying()) {
      this.stop();
      this.start();
    }
  }

  setTempo(tempo: number): void {
    this.currentTempo.set(tempo);
  }

  setVolume(volume: number): void {
    this.audioService.setVolume(volume);
  }
}
