import type { GameConfig, GameValues, StateKey } from '../data/types';

export interface SituationHint {
  title: string;
  detail: string;
  color: string;
}

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

const getStateLabel = (config: GameConfig, key?: StateKey, fallback = '系统状态') => {
  if (!key) {
    return fallback;
  }

  return config.stateLabels[key]?.label ?? fallback;
};

export class SituationAdvisor {
  static evaluate(config: GameConfig, values: GameValues): SituationHint {
    const bindings = config.visualTheme.stateBindings;
    const resourceKey = bindings?.resourceKey ?? Object.keys(config.stateLabels)[0];
    const trustKey = bindings?.trustKey ?? Object.keys(config.stateLabels)[1];
    const governanceKey = bindings?.governanceKey ?? Object.keys(config.stateLabels)[2];

    const resource = normalizeState(config, values, resourceKey);
    const trust = normalizeState(config, values, trustKey);
    const governance = normalizeState(config, values, governanceKey);
    const resourceLabel = getStateLabel(config, resourceKey, '公共资源');
    const trustLabel = getStateLabel(config, trustKey, '合作信任');
    const governanceLabel = getStateLabel(config, governanceKey, '治理机制');

    if (resource <= 0.22) {
      return {
        title: '临界警报',
        detail: `${resourceLabel}接近崩坏，下一步会决定系统能否回头。`,
        color: '#a85f3c',
      };
    }

    if (trust <= 0.25) {
      return {
        title: '关系破裂',
        detail: `${trustLabel}很低，短利行动会继续放大冲突。`,
        color: '#a85f3c',
      };
    }

    if (governance >= 0.72 && resource >= 0.45) {
      return {
        title: '治理成形',
        detail: `${governanceLabel}正在稳住局面，可以继续巩固规则。`,
        color: '#4f7a3d',
      };
    }

    if (resource <= 0.5) {
      return {
        title: '资源承压',
        detail: `${resourceLabel}已被消耗，个人收益和公共底线开始冲突。`,
        color: '#8b6a3d',
      };
    }

    if (governance <= 0.35 && trust <= 0.55) {
      return {
        title: '规则薄弱',
        detail: `${governanceLabel}不足，单靠善意很难阻止系统滑坡。`,
        color: '#8b6a3d',
      };
    }

    return {
      title: '局势平稳',
      detail: `${resourceLabel}仍有余地，但局部诱惑已经出现。`,
      color: '#203b2a',
    };
  }
}
