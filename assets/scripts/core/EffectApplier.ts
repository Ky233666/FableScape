import type { AppliedEffect, ChoiceConfig, GameValues, StateLabels } from '../data/types';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export class EffectApplier {
  static apply(values: GameValues, choice: ChoiceConfig, labels: StateLabels): AppliedEffect[] {
    const changes: AppliedEffect[] = [];

    Object.entries(choice.effects).forEach(([key, delta]) => {
      const label = labels[key];
      const before = values[key] ?? 0;
      const after = label ? clamp(before + delta, label.min, label.max) : before + delta;
      values[key] = after;
      changes.push({ key, before, after, delta: after - before });
    });

    return changes;
  }
}
