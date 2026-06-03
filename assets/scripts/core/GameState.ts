import type { ChoiceConfig, ChoiceHistoryItem, GameConfig, GameValues, RoundConfig } from '../data/types';

export class RuntimeGameState {
  values: GameValues = {};
  history: ChoiceHistoryItem[] = [];
  currentRoundIndex = 0;

  reset(config: GameConfig) {
    this.values = { ...config.initialState };
    this.history = [];
    this.currentRoundIndex = 0;
  }

  getCurrentRound(config: GameConfig): RoundConfig | null {
    return config.rounds[this.currentRoundIndex] ?? null;
  }

  recordChoice(round: RoundConfig, choice: ChoiceConfig) {
    this.history.push({
      roundId: round.id,
      choiceId: choice.id,
      effects: { ...choice.effects },
      tags: [...(choice.tags ?? [])],
    });
  }

  advanceRound() {
    this.currentRoundIndex += 1;
  }

  getTagCount(tag: string) {
    return this.history.reduce((count, item) => {
      return count + (item.tags.includes(tag) ? 1 : 0);
    }, 0);
  }
}
