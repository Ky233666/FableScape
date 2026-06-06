import type { ChoiceHistoryItem, EndingConfig, GameConfig, GameValues, StateCondition, TagCondition } from '../data/types';

export interface ReplaySuggestion {
  title: string;
  detail: string;
}

const tagLabels: Record<string, string> = {
  short_gain: '短利',
  overuse: '扩张',
  rule: '规则',
  institution: '制度',
  mechanism: '机制',
  aligned: '激励相容',
  careful: '谨慎',
  restraint: '克制',
  explore: '探索',
  negotiate: '谈判',
  verify: '验证',
  quorum: '法定确认',
  inspect: '核验',
  defect: '背离',
  conflict: '冲突',
};

const compare = (value: number, condition: StateCondition) => {
  switch (condition.op) {
    case '<':
      return value < condition.value;
    case '<=':
      return value <= condition.value;
    case '>':
      return value > condition.value;
    case '>=':
      return value >= condition.value;
    case '==':
      return value === condition.value;
    case '!=':
      return value !== condition.value;
    default:
      return false;
  }
};

const formatStateGap = (config: GameConfig, values: GameValues, condition: StateCondition) => {
  const current = values[condition.key] ?? 0;
  const label = config.stateLabels[condition.key]?.label ?? condition.key;
  if (condition.op === '>=' || condition.op === '>') {
    const gap = Math.max(1, Math.ceil(condition.value - current + (condition.op === '>' ? 1 : 0)));
    return `${label}再提高约 ${gap}`;
  }
  if (condition.op === '<=' || condition.op === '<') {
    const gap = Math.max(1, Math.ceil(current - condition.value + (condition.op === '<' ? 1 : 0)));
    return `${label}再降低约 ${gap}`;
  }
  return `让${label}接近 ${condition.value}`;
};

const countTag = (history: ChoiceHistoryItem[], tag: string) => {
  return history.reduce((count, item) => count + (item.tags.includes(tag) ? 1 : 0), 0);
};

const formatTagGap = (history: ChoiceHistoryItem[], condition: TagCondition) => {
  const current = countTag(history, condition.tag);
  const missing = Math.max(1, condition.minCount - current);
  return `多选择「${tagLabels[condition.tag] ?? condition.tag}」行动 ${missing} 次`;
};

const getMissingSteps = (
  config: GameConfig,
  values: GameValues,
  history: ChoiceHistoryItem[],
  ending: EndingConfig,
) => {
  const stateSteps = (ending.condition.state ?? [])
    .filter((condition) => !compare(values[condition.key] ?? 0, condition))
    .map((condition) => formatStateGap(config, values, condition));
  const tagSteps = (ending.condition.tags ?? [])
    .filter((condition) => countTag(history, condition.tag) < condition.minCount)
    .map((condition) => formatTagGap(history, condition));

  return [...stateSteps, ...tagSteps];
};

export class ReplayAdvisor {
  static suggest(
    config: GameConfig,
    currentEnding: EndingConfig,
    values: GameValues,
    history: ChoiceHistoryItem[],
  ): ReplaySuggestion {
    const candidates = config.endings
      .filter((ending) => ending.id !== currentEnding.id && ending.priority > 0)
      .map((ending) => ({
        ending,
        missing: getMissingSteps(config, values, history, ending),
      }))
      .sort((left, right) => {
        if (left.missing.length !== right.missing.length) {
          return left.missing.length - right.missing.length;
        }
        return right.ending.priority - left.ending.priority;
      });

    const target = candidates[0];
    if (!target) {
      return {
        title: '下一次尝试',
        detail: '尝试连续选择另一类策略，观察同一系统如何滑向不同结局。',
      };
    }

    if (target.missing.length === 0) {
      return {
        title: `下一次尝试：${target.ending.title}`,
        detail: '你已经接近另一条分支，回到转折点换一个最后行动，可能会触发新结局。',
      };
    }

    return {
      title: `下一次尝试：${target.ending.title}`,
      detail: target.missing.slice(0, 2).join('；'),
    };
  }
}
