import type { GameConfig, GameValues, StateKey } from '../data/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const normalizeState = (config: GameConfig, values: GameValues, key?: StateKey) => {
  if (!key) {
    return 0.5;
  }

  const label = config.stateLabels[key];
  if (!label) {
    return 0.5;
  }

  const value = values[key] ?? label.min;
  return clamp01((value - label.min) / Math.max(1, label.max - label.min));
};

export class TensionEvaluator {
  static evaluate(config: GameConfig, values: GameValues) {
    const bindings = config.visualTheme.stateBindings;
    const resource = normalizeState(config, values, bindings?.resourceKey);
    const trust = normalizeState(config, values, bindings?.trustKey);
    const governance = normalizeState(config, values, bindings?.governanceKey);
    const scarcityPressure = 1 - resource;
    const distrustPressure = 1 - trust;
    const weakRulePressure = 1 - governance;
    const governanceRelief = governance > 0.65 && resource > 0.38 ? 0.12 : 0;

    return clamp01(
      scarcityPressure * 0.52
        + distrustPressure * 0.32
        + weakRulePressure * 0.18
        - governanceRelief,
    );
  }
}
