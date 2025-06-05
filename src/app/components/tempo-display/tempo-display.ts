import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tempo-display',
  standalone: true,
  template: `
    <div class="tempo-display">
      <div class="tempo-value">{{ tempo() }}</div>
      <div class="tempo-label">BPM</div>
    </div>
  `,
  styles: [`
    .tempo-display {
      text-align: center;
    }

    .tempo-value {
      font-size: 4em;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .tempo-label {
      font-size: 1.2em;
      opacity: 0.8;
    }
  `]
})
export class TempoDisplayComponent {
  readonly tempo = input.required<number>();
}
