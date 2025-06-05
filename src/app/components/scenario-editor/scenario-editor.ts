import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScenarioStep } from '../../models/metronome.types';

@Component({
  selector: 'app-scenario-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="scenario-editor">
      <h4>Створити новий сценарій</h4>

      <div class="form-group">
        <label>Назва сценарію:</label>
        <input
          type="text"
          [(ngModel)]="scenarioName"
          placeholder="Введіть назву сценарію"
          class="input-field">
      </div>

      <div class="steps-editor">
        <h5>Кроки сценарію:</h5>
        <div *ngFor="let step of steps(); let i = index" class="step-editor">
          <div class="step-header">Крок {{ i + 1 }}</div>
          <div class="step-fields">
            <input
              type="text"
              [(ngModel)]="step.name"
              placeholder="Назва кроку (опціонально)"
              class="input-field">
            <input
              type="number"
              [(ngModel)]="step.tempo"
              placeholder="Темп (BPM)"
              min="40"
              max="200"
              class="input-field small">
            <input
              type="number"
              [(ngModel)]="step.duration"
              placeholder="Тривалість (сек)"
              min="1"
              class="input-field small">
            <button class="remove-btn" (click)="removeStep(i)">❌</button>
          </div>
        </div>

        <button class="add-step-btn" (click)="addStep()">➕ Додати крок</button>
      </div>

      <button
        class="save-scenario-btn"
        [disabled]="!canSave()"
        (click)="save()">
        Зберегти сценарій
      </button>
    </div>
  `,
  styles: [`
    .scenario-editor {
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .input-field {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: rgba(255,255,255,0.9);
      color: #333;
      margin-top: 5px;
    }

    .input-field.small {
      width: auto;
      min-width: 80px;
    }

    .step-editor {
      background: rgba(255,255,255,0.05);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .step-header {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .step-fields {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .remove-btn {
      background: #f44336;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      color: white;
    }

    .add-step-btn, .save-scenario-btn {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 10px;
    }

    .save-scenario-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .step-fields {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ScenarioEditorComponent {
  readonly steps = signal<ScenarioStep[]>([]);
  scenarioName = '';

  readonly scenarioSave = output<{ name: string, steps: ScenarioStep[] }>();

  constructor() {
    this.addStep(); // Додаємо перший крок
  }

  addStep(): void {
    this.steps.update(steps => [...steps, {
      tempo: 120,
      duration: 30,
      name: ''
    }]);
  }

  removeStep(index: number): void {
    this.steps.update(steps => steps.filter((_, i) => i !== index));
  }

  canSave(): boolean {
    return this.scenarioName.trim() !== '' &&
      this.steps().length > 0 &&
      this.steps().every(step => step.tempo > 0 && step.duration > 0);
  }

  save(): void {
    if (!this.canSave()) return;

    this.scenarioSave.emit({
      name: this.scenarioName.trim(),
      steps: [...this.steps()]
    });

    // Очищаємо форму
    this.scenarioName = '';
    this.steps.set([]);
    this.addStep();
  }
}
