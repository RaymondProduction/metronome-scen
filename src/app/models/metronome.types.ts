export interface Scenario {
  id: string;
  name: string;
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  tempo: number;
  duration: number; // in seconds
  name?: string;
}

export interface PresetTempo {
  name: string;
  tempo: number;
  color: string;
}

export interface MetronomeState {
  currentTempo: number;
  isPlaying: boolean;
  volume: number;
}

export interface ScenarioState {
  scenarios: Scenario[];
  selectedScenarioId: string;
  scenarioRunning: boolean;
  currentScenario: Scenario | null;
  currentStepIndex: number;
  stepTimeRemaining: number;
}
