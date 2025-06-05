import { Component, output } from '@angular/core';

@Component({
  selector: 'app-play-controls',
  standalone: true,
  template: `
    <div class="play-controls">
      <button
        class="play-btn"
        [class.playing]="isPlaying()"
        (click)="onToggle()">
        {{ isPlaying() ? '⏸️' : '▶️' }}
      </button>
      <button class="stop-btn" (click)="onStop()">⏹️</button>
    </div>
  `,
  styles: [`
    .play-controls {
      display: flex;
      gap: 15px;
    }

    .play-btn, .stop-btn {
      width: 60px;
      height: 60px;
      border: none;
      border-radius: 50%;
      font-size: 1.5em;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .play-btn {
      background: #4CAF50;
      color: white;
    }

    .play-btn.playing {
      background: #FF9800;
      animation: pulse 1s infinite;
    }

    .stop-btn {
      background: #f44336;
      color: white;
    }

    .play-btn:hover, .stop-btn:hover {
      transform: scale(1.1);
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class PlayControlsComponent {
  readonly isPlaying = input.required<boolean>();

  readonly toggle = output<void>();
  readonly stop = output<void>();

  onToggle(): void {
    this.toggle.emit();
  }

  onStop(): void {
    this.stop.emit();
  }
}
