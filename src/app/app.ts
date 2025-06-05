import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TempoDisplayComponent } from './components/tempo-display/tempo-display';
import { PlayControlsComponent } from './components/play-controls/play-controls';
import { TempoPresetsComponent } from './components/tempo-presets/tempo-presets';
import { ScenarioRunnerComponent } from './components/scenario-runner/scenario-runner';
import { ScenarioEditorComponent } from './components/scenario-editor/scenario-editor';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    TempoDisplayComponent,
    PlayControlsComponent,
    TempoPresetsComponent,
    ScenarioRunnerComponent,
    ScenarioEditorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'metronome-scen';
}
