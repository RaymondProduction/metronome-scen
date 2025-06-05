import { Component, input, output } from '@angular/core';
import { Scenario, ScenarioStep } from '../../models/metronome.types';

@Component({
  selector: 'app-scenario-runner',
  standalone: true,
  template: `
    <div class="scenario-controls">
      <select [value]="selectedScenarioId()" (change)="onScenarioSelect($event)" class="scenario-select">
        <option value="">Оберіть сценарій</option>
        <option *ngFor="let scenario of scenarios()" [value]="scenario.id">
          {{ scenario.name }}
        </option>
      </select>

      <button
        class="scenario-btn"
        [disabled]="!selectedScenarioId()"
        (click)="onStart()">
        Запустити сценарій
      </button>

      <button
        class="scenario-btn stop"
        [disabled]="!scenarioRunning()"
        (click)="onStop()">
        Зупинити сценарій
      </button>
    </div>

    @if (scenarioRunning() && currentScenario() && currentStep()) {
      <div class="scenario-info">
        <h4>{{ currentScenario()!.name }} - Крок {{ currentStepIndex() + 1 }}/{{ currentScenario()!.steps.length }}</h4>
        <div class="step-info">
          <p><strong>{{ currentStep()!.name || 'Крок ' + (currentStepIndex() + 1) }}</strong></p>
          <p>Темп: {{ currentStep()!.tempo }} BPM</p>
          <p>Час: {{ stepTimeRemaining() }}с / {{ currentStep()!.duration }}с</p>
          <div class="progress-bar">
            <div
              class="progress"
              [style.width.%]="stepProgress()">
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .scenario-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .scenario-select {
      flex: 1;
      min-width: 200px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: rgba(255,255,255,0.9);
      color: #333;
    }

    .scenario-btn {
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    .scenario-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .scenario-btn.stop {
      background: #f44336;
    }

    .scenario-info {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .step-info {
      margin-top: 10px;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: rgba(255,255,255,0.2);
      border-radius: 5px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      transition: width 0.1s ease;
    }
  `]
})
export class ScenarioRunnerComponent {
  readonly scenarios = input.required<Scenario[]>();
  readonly selectedScenarioId = input.required<string>();
  readonly scenarioRunning = input.required<boolean>();
  readonly currentScenario = input.required<Scenario | null>();
  readonly currentStep = input.required<ScenarioStep | null>();
  readonly currentStepIndex = input.required<number>();
  readonly stepTimeRemaining = input.required<number>();
  readonly stepProgress = input.required<number>();

  readonly scenarioSelect = output<string>();
  readonly start = output<string>();
  readonly stop = output<void>();

  onScenarioSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.scenarioSelect.emit(target.value);
  }

  onStart(): void {
    this.start.emit(this.selectedScenarioId());
  }

  onStop(): void {
    this.stop.emit();
  }
}
