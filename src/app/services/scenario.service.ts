import { Injectable, signal, computed } from '@angular/core';
import { Scenario, ScenarioState, ScenarioStep } from '../models/metronome.types';
import { MetronomeService } from './metronome.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private stepInterval: any = null;

  readonly scenarios = signal<Scenario[]>([]);
  readonly selectedScenarioId = signal<string>('');
  readonly scenarioRunning = signal<boolean>(false);
  readonly currentScenario = signal<Scenario | null>(null);
  readonly currentStepIndex = signal<number>(0);
  readonly stepTimeRemaining = signal<number>(0);

  readonly state = computed<ScenarioState>(() => ({
    scenarios: this.scenarios(),
    selectedScenarioId: this.selectedScenarioId(),
    scenarioRunning: this.scenarioRunning(),
    currentScenario: this.currentScenario(),
    currentStepIndex: this.currentStepIndex(),
    stepTimeRemaining: this.stepTimeRemaining()
  }));

  readonly currentStep = computed<ScenarioStep | null>(() => {
    const scenario = this.currentScenario();
    const index = this.currentStepIndex();

    if (!scenario || index >= scenario.steps.length) {
      return null;
    }

    return scenario.steps[index];
  });

  readonly stepProgress = computed<number>(() => {
    const step = this.currentStep();
    const remaining = this.stepTimeRemaining();

    if (!step) return 0;

    return ((step.duration - remaining) / step.duration) * 100;
  });

  constructor(private metronomeService: MetronomeService) {
    this.loadDemoScenarios();
  }

  async startScenario(scenarioId: string): Promise<void> {
    const scenario = this.scenarios().find(s => s.id === scenarioId);
    if (!scenario) return;

    this.currentScenario.set(scenario);
    this.scenarioRunning.set(true);
    this.currentStepIndex.set(0);
    await this.executeCurrentStep();
  }

  stopScenario(): void {
    this.scenarioRunning.set(false);
    this.currentScenario.set(null);
    this.currentStepIndex.set(0);
    this.stepTimeRemaining.set(0);

    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }

    this.metronomeService.stop();
  }

  private async executeCurrentStep(): Promise<void> {
    const scenario = this.currentScenario();
    const stepIndex = this.currentStepIndex();

    if (!scenario || stepIndex >= scenario.steps.length) {
      this.stopScenario();
      return;
    }

    const step = scenario.steps[stepIndex];
    this.metronomeService.setTempo(step.tempo);
    this.stepTimeRemaining.set(step.duration);

    // Запускаємо метроном з новим темпом
    if (this.metronomeService.state().isPlaying) {
      this.metronomeService.stop();
    }
    await this.metronomeService.start();

    // Відлік часу кроку
    this.stepInterval = setInterval(() => {
      const remaining = this.stepTimeRemaining();

      if (remaining <= 1) {
        clearInterval(this.stepInterval);
        this.currentStepIndex.set(stepIndex + 1);
        this.executeCurrentStep();
      } else {
        this.stepTimeRemaining.set(remaining - 1);
      }
    }, 1000);
  }

  addScenario(scenario: Omit<Scenario, 'id'>): void {
    const newScenario: Scenario = {
      ...scenario,
      id: Date.now().toString()
    };

    this.scenarios.update(scenarios => [...scenarios, newScenario]);
  }

  deleteScenario(id: string): void {
    this.scenarios.update(scenarios => scenarios.filter(s => s.id !== id));

    if (this.selectedScenarioId() === id) {
      this.selectedScenarioId.set('');
    }
  }

  private loadDemoScenarios(): void {
    const demoScenarios: Scenario[] = [
      {
        id: 'warmup',
        name: 'Розминка',
        steps: [
          { tempo: 60, duration: 30, name: 'Повільний старт' },
          { tempo: 80, duration: 30, name: 'Прискорення' },
          { tempo: 100, duration: 60, name: 'Робочий темп' }
        ]
      },
      {
        id: 'practice',
        name: 'Практика',
        steps: [
          { tempo: 90, duration: 120, name: 'Основна частина' },
          { tempo: 110, duration: 60, name: 'Прискорення' },
          { tempo: 90, duration: 60, name: 'Заключна частина' }
        ]
      }
    ];

    this.scenarios.set(demoScenarios);
  }
}
