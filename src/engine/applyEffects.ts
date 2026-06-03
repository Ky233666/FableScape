import type { ChoiceEffects, GameState, StateLabels } from '../types/game';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const applyEffects = (
  currentState: GameState,
  effects: ChoiceEffects,
  labels: StateLabels,
): GameState => {
  const nextState: GameState = { ...currentState };

  Object.entries(effects).forEach(([key, delta]) => {
    const limits = labels[key];
    const currentValue = nextState[key] ?? 0;
    nextState[key] = limits
      ? clamp(currentValue + delta, limits.min, limits.max)
      : currentValue + delta;
  });

  return nextState;
};
