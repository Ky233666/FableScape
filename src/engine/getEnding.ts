import type { ChoiceRecord, Ending, GameConfig, GameState } from '../types/game';

export const getEnding = (
  config: GameConfig,
  state: GameState,
  history: ChoiceRecord[],
): Ending => {
  return (
    config.endings.find((ending) => ending.condition(state, history)) ??
    config.endings[config.endings.length - 1]
  );
};
