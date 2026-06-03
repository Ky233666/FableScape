import type {
  ChoiceHistoryItem,
  CompareOperator,
  EndingConfig,
  EndingCondition,
  GameConfig,
  GameValues,
} from '../data/types';

const compare = (left: number, op: CompareOperator, right: number) => {
  switch (op) {
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '==':
      return left === right;
    case '!=':
      return left !== right;
    default:
      return false;
  }
};

const tagCount = (history: ChoiceHistoryItem[], tag: string) => {
  return history.reduce((count, item) => count + (item.tags.includes(tag) ? 1 : 0), 0);
};

const matchesCondition = (
  condition: EndingCondition,
  values: GameValues,
  history: ChoiceHistoryItem[],
) => {
  const stateOk = (condition.state ?? []).every((rule) => {
    return compare(values[rule.key] ?? 0, rule.op, rule.value);
  });
  const tagsOk = (condition.tags ?? []).every((rule) => {
    return tagCount(history, rule.tag) >= rule.minCount;
  });

  return stateOk && tagsOk;
};

export class EndingEvaluator {
  static evaluate(config: GameConfig, values: GameValues, history: ChoiceHistoryItem[]): EndingConfig {
    const sorted = [...config.endings].sort((a, b) => b.priority - a.priority);
    return sorted.find((ending) => matchesCondition(ending.condition, values, history)) ?? sorted[sorted.length - 1];
  }
}
