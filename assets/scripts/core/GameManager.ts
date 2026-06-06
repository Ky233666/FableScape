import { Component, _decorator } from 'cc';
import type { AppliedEffect, ChoiceConfig, EndingConfig, GameCatalogItem, GameConfig, RoundConfig } from '../data/types';
import { ConfigLoader } from './ConfigLoader';
import { EffectApplier } from './EffectApplier';
import { EndingEvaluator } from './EndingEvaluator';
import { EventCenter, GameEvents } from './EventCenter';
import { ProgressStore } from './ProgressStore';
import { RuntimeGameState } from './GameState';
import { StartUI } from '../ui/StartUI';
import { DialogPanel } from '../ui/DialogPanel';
import { ChoicePanel } from '../ui/ChoicePanel';
import { StatusPanel } from '../ui/StatusPanel';
import { FeedbackPanel } from '../ui/FeedbackPanel';
import { EndingPanel } from '../ui/EndingPanel';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { VisualStateController } from '../gameplay/VisualStateController';
import { AudioController } from '../gameplay/AudioController';
import { CameraController } from '../gameplay/CameraController';

const { ccclass } = _decorator;

interface GameBindings {
  startUI: StartUI;
  dialogPanel: DialogPanel;
  choicePanel: ChoicePanel;
  statusPanel: StatusPanel;
  feedbackPanel: FeedbackPanel;
  endingPanel: EndingPanel;
  progressIndicator: ProgressIndicator;
  visualStateController: VisualStateController;
  audioController: AudioController;
  cameraController: CameraController;
}

@ccclass('GameManager')
export class GameManager extends Component {
  private config!: GameConfig;
  private catalog: GameCatalogItem[] = [];
  private runtimeState = new RuntimeGameState();
  private bindings!: GameBindings;
  private pendingChoice: ChoiceConfig | null = null;
  private pendingChanges: AppliedEffect[] = [];
  private currentEnding: EndingConfig | null = null;

  bind(bindings: GameBindings) {
    this.bindings = bindings;
    this.catalog = ConfigLoader.listGames();
    this.config = ConfigLoader.loadDefaultGame();
    this.runtimeState.reset(this.config);
    this.bindUI();
    this.showStart();
  }

  private bindUI() {
    this.bindings.startUI.setStartHandler(() => this.startGame());
    this.bindings.startUI.setGameSelectHandler((gameId) => this.selectGame(gameId));
    this.bindings.choicePanel.setChoiceHandler((choice) => this.handleChoice(choice));
    this.bindings.feedbackPanel.setContinueHandler(() => this.continueAfterFeedback());
    this.bindings.endingPanel.setRestartHandler(() => this.restartGame());
    this.bindings.endingPanel.setHomeHandler(() => this.showStart());
  }

  private showStart() {
    this.runtimeState.reset(this.config);
    this.pendingChoice = null;
    this.pendingChanges = [];
    this.currentEnding = null;
    this.bindings.startUI.show(this.catalog, this.config, this.getProgressSummary());
    this.bindings.dialogPanel.hide();
    this.bindings.choicePanel.hide();
    this.bindings.statusPanel.hide();
    this.bindings.feedbackPanel.hide();
    this.bindings.endingPanel.hide();
    this.bindings.progressIndicator.hide();
    this.bindings.visualStateController.applyState(this.config, this.runtimeState.values);
  }

  private selectGame(gameId: string) {
    this.config = ConfigLoader.loadGame(gameId);
    this.runtimeState.reset(this.config);
    this.pendingChoice = null;
    this.pendingChanges = [];
    this.currentEnding = null;
    this.bindings.visualStateController.applyState(this.config, this.runtimeState.values);
  }

  startGame() {
    this.runtimeState.reset(this.config);
    this.pendingChoice = null;
    this.pendingChanges = [];
    this.currentEnding = null;
    this.bindings.startUI.hide();
    this.bindings.endingPanel.hide();
    this.bindings.statusPanel.show(this.config.stateLabels, this.runtimeState.values);
    this.bindings.feedbackPanel.hide();
    this.bindings.progressIndicator.show(1, this.config.rounds.length);
    this.bindings.visualStateController.applyState(this.config, this.runtimeState.values);
    this.showCurrentRound();
    EventCenter.emit(GameEvents.Restarted, this.runtimeState.values);
  }

  private showCurrentRound() {
    const round = this.runtimeState.getCurrentRound(this.config);
    if (!round) {
      this.enterEnding();
      return;
    }

    this.bindings.dialogPanel.show(round);
    this.bindings.choicePanel.show(round.choices);
    this.bindings.feedbackPanel.hide();
    this.bindings.progressIndicator.show(round.roundIndex, this.config.rounds.length);
    this.bindings.visualStateController.applyMood(round.sceneMood);
    EventCenter.emit(GameEvents.RoundChanged, round, this.runtimeState.values);
  }

  private handleChoice(choice: ChoiceConfig) {
    const round = this.runtimeState.getCurrentRound(this.config);
    if (!round || this.pendingChoice) {
      return;
    }

    this.pendingChoice = choice;
    this.bindings.choicePanel.setInteractable(false);
    this.pendingChanges = EffectApplier.apply(this.runtimeState.values, choice, this.config.stateLabels);
    this.runtimeState.recordChoice(round, choice);

    this.bindings.statusPanel.refresh(this.runtimeState.values, this.pendingChanges);
    this.bindings.choicePanel.hide();
    this.bindings.visualStateController.applyReaction(choice.visualReaction, this.runtimeState.values);
    this.bindings.cameraController.playReaction(choice.visualReaction);
    this.bindings.audioController.playCue(choice.soundCue);

    this.scheduleOnce(() => {
      this.bindings.feedbackPanel.show(choice, this.pendingChanges, this.config.stateLabels);
      EventCenter.emit(GameEvents.FeedbackReady, choice, this.runtimeState.values);
    }, 0.45);

    EventCenter.emit(GameEvents.ChoiceApplied, choice, this.runtimeState.values, this.pendingChanges);
  }

  private continueAfterFeedback() {
    if (!this.pendingChoice) {
      return;
    }

    this.pendingChoice = null;
    this.pendingChanges = [];
    this.runtimeState.advanceRound();
    this.bindings.visualStateController.applyState(this.config, this.runtimeState.values);

    if (this.runtimeState.currentRoundIndex >= this.config.rounds.length) {
      this.enterEnding();
      return;
    }

    this.bindings.choicePanel.setInteractable(true);
    this.showCurrentRound();
  }

  private enterEnding() {
    this.currentEnding = EndingEvaluator.evaluate(
      this.config,
      this.runtimeState.values,
      this.runtimeState.history,
    );
    this.bindings.dialogPanel.hide();
    this.bindings.choicePanel.hide();
    this.bindings.feedbackPanel.hide();
    this.bindings.progressIndicator.hide();
    this.bindings.statusPanel.hide();
    this.bindings.visualStateController.applyReaction(this.currentEnding.finalVisualState, this.runtimeState.values);
    this.bindings.audioController.playCue(this.currentEnding.id === 'governance' ? 'ending_good' : 'ending_bad');
    const progressUpdate = ProgressStore.recordEnding(
      this.config.id,
      this.currentEnding.id,
      ConfigLoader.getEndingCount(this.config.id),
    );
    this.bindings.endingPanel.show(
      this.config,
      this.currentEnding,
      this.runtimeState.values,
      this.runtimeState.history,
      progressUpdate,
    );
    EventCenter.emit(GameEvents.EndingReached, this.currentEnding, this.runtimeState.values);
  }

  private restartGame() {
    this.startGame();
  }

  getCurrentRound(): RoundConfig | null {
    return this.runtimeState.getCurrentRound(this.config);
  }

  private getProgressSummary() {
    return this.catalog.reduce<Record<string, ReturnType<typeof ProgressStore.getGameProgress>>>((summary, game) => {
      summary[game.id] = ProgressStore.getGameProgress(game.id, ConfigLoader.getEndingCount(game.id));
      return summary;
    }, {});
  }
}
