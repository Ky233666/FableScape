import type { ChoiceHistoryItem, GameConfig } from '../data/types';

export interface MechanismTrace {
  title: string;
  detail: string;
}

const getRoundChoice = (config: GameConfig, item: ChoiceHistoryItem) => {
  const round = config.rounds.find((candidate) => candidate.id === item.roundId);
  const choice = round?.choices.find((candidate) => candidate.id === item.choiceId);
  return { round, choice };
};

const getKeyLabel = (config: GameConfig, key: string) => config.stateLabels[key]?.label ?? key;

const impactScore = (config: GameConfig, item: ChoiceHistoryItem) => {
  const bindings = config.visualTheme.stateBindings;
  const resourceKey = bindings?.resourceKey;
  const trustKey = bindings?.trustKey;
  const governanceKey = bindings?.governanceKey;
  const wealthKey = bindings?.wealthKey;

  return Object.entries(item.effects).reduce((score, [key, delta]) => {
    if (key === resourceKey) {
      return score + Math.abs(delta) * 1.7;
    }
    if (key === trustKey) {
      return score + Math.abs(delta) * 1.35;
    }
    if (key === governanceKey) {
      return score + Math.abs(delta) * 1.2;
    }
    if (key === wealthKey) {
      return score + Math.abs(delta) * 0.85;
    }
    return score + Math.abs(delta);
  }, 0);
};

const formatMainEffects = (config: GameConfig, item: ChoiceHistoryItem) => {
  const effects = Object.entries(item.effects)
    .filter(([, delta]) => delta !== 0)
    .sort(([, left], [, right]) => Math.abs(right) - Math.abs(left))
    .slice(0, 3)
    .map(([key, delta]) => `${getKeyLabel(config, key)}${delta > 0 ? '+' : ''}${delta}`);

  return effects.join('，');
};

const getMechanismSentence = (config: GameConfig, item: ChoiceHistoryItem) => {
  const bindings = config.visualTheme.stateBindings;
  const resourceDelta = bindings?.resourceKey ? item.effects[bindings.resourceKey] ?? 0 : 0;
  const trustDelta = bindings?.trustKey ? item.effects[bindings.trustKey] ?? 0 : 0;
  const governanceDelta = bindings?.governanceKey ? item.effects[bindings.governanceKey] ?? 0 : 0;
  const wealthDelta = bindings?.wealthKey ? item.effects[bindings.wealthKey] ?? 0 : 0;

  if (wealthDelta > 0 && (resourceDelta < 0 || trustDelta < 0)) {
    return '这一步把个人收益和系统成本分开，是当前结局的重要转折。';
  }
  if (governanceDelta > 0 && (resourceDelta >= 0 || trustDelta >= 0)) {
    return '这一步把分散行动拉回规则和协作，是系统被重新稳定的关键。';
  }
  if (resourceDelta < 0 || trustDelta < 0) {
    return '这一步削弱了公共底盘，让后续选择更容易被迫在坏局面里发生。';
  }
  if (governanceDelta > 0) {
    return '这一步没有立刻带来最高收益，但改变了后续选择的制度环境。';
  }
  return '这一步对多个变量产生了连锁影响，改变了后续分支的方向。';
};

export class MechanismTraceEvaluator {
  static evaluate(config: GameConfig, history: ChoiceHistoryItem[]): MechanismTrace {
    if (history.length === 0) {
      return {
        title: '机制转折点',
        detail: '本次还没有记录到行动，无法分析系统转折。',
      };
    }

    const turningPoint = [...history]
      .map((item, index) => ({ item, index, score: impactScore(config, item) }))
      .sort((left, right) => right.score - left.score)[0];
    const { round, choice } = getRoundChoice(config, turningPoint.item);
    const choiceText = choice?.text ?? turningPoint.item.choiceId;
    const roundTitle = round?.title ?? `第 ${turningPoint.index + 1} 轮`;
    const effects = formatMainEffects(config, turningPoint.item);
    const sentence = getMechanismSentence(config, turningPoint.item);

    return {
      title: `机制转折点：${roundTitle}`,
      detail: `你选择了「${choiceText}」。${effects ? `主要影响：${effects}。` : ''}${sentence}`,
    };
  }
}
