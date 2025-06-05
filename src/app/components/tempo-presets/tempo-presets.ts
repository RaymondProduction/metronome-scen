import { Component, output } from '@angular/core';
import { PresetTempo } from '../../models/metronome.types';

@Component({
  selector: 'app-tempo-presets',
  standalone: true,
  template: `
    <div class="preset-tempos">
      <h3>Швидкі темпи</h3>
      <div class="preset-grid">
        <button
          *ngFor="let preset of presetTempos"
          class="preset-btn"
          [style.background-color]="preset.color"
          (click)="onPresetSelect(preset.tempo)">
          {{ preset.name }}<br>
          <small>{{ preset.tempo }} BPM</small>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .preset-tempos {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }

    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .preset-btn {
      padding: 15px;
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .preset-btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class TempoPresetsComponent {
  readonly tempoSelect = output<number>();

  readonly presetTempos: PresetTempo[] = [
    { name: 'Largo', tempo: 60, color: '#3F51B5' },
    { name: 'Adagio', tempo: 70, color: '#673AB7' },
    { name: 'Andante', tempo: 90, color: '#9C27B0' },
    { name: 'Moderato', tempo: 120, color: '#E91E63' },
    { name: 'Allegro', tempo: 140, color: '#F44336' },
    { name: 'Presto', tempo: 180, color: '#FF5722' }
  ];

  onPresetSelect(tempo: number): void {
    this.tempoSelect.emit(tempo);
  }
}
