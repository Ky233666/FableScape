import type { AppliedEffect, GameConfig } from '../data/types';

const getDelta = (changes: AppliedEffect[], key?: string) => {
  if (!key) {
    return 0;
  }

  return changes.find((change) => change.key === key)?.delta ?? 0;
};

const getLabel = (config: GameConfig, key?: string, fallback = '系统变量') => {
  if (!key) {
    return fallback;
  }

  return config.stateLabels[key]?.label ?? fallback;
};

export class ChoiceMechanismNarrator {
  static narrate(config: GameConfig, changes: AppliedEffect[]) {
    const bindings = config.visualTheme.stateBindings;
    const wealthDelta = getDelta(changes, bindings?.wealthKey);
    const resourceDelta = getDelta(changes, bindings?.resourceKey);
    const trustDelta = getDelta(changes, bindings?.trustKey);
    const governanceDelta = getDelta(changes, bindings?.governanceKey);
    const resourceLabel = getLabel(config, bindings?.resourceKey, '公共资源');
    const trustLabel = getLabel(config, bindings?.trustKey, '信任');
    const governanceLabel = getLabel(config, bindings?.governanceKey, '规则');

    if (wealthDelta > 0 && (resourceDelta < 0 || trustDelta < 0)) {
      return `机制解释：短期收益被你拿走，但${resourceDelta < 0 ? resourceLabel : trustLabel}承担了成本。`;
    }

    if (governanceDelta > 0 && (resourceDelta >= 0 || trustDelta >= 0)) {
      return `机制解释：${governanceLabel}增强后，分散行动开始被共同约束。`;
    }

    if (governanceDelta > 0) {
      return `机制解释：你在提高${governanceLabel}，这是让系统不只依赖个人自觉的关键。`;
    }

    if (resourceDelta < 0 || trustDelta < 0) {
      return `机制解释：${resourceDelta < 0 ? resourceLabel : trustLabel}被削弱，后续选择空间会变窄。`;
    }

    if (resourceDelta > 0 || trustDelta > 0) {
      return `机制解释：你在修复${resourceDelta > 0 ? resourceLabel : trustLabel}，系统稳定性因此提高。`;
    }

    return `机制解释：这一步没有立刻改变核心底盘，但会累积进${config.conceptName}的运行过程。`;
  }
}
