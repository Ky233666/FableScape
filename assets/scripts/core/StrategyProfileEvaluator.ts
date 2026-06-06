import type { ChoiceHistoryItem, GameConfig } from '../data/types';

export interface StrategyProfile {
  title: string;
  summary: string;
  stats: string[];
}

const tagGroups = {
  institution: [
    'institution',
    'governance',
    'rule',
    'aligned',
    'mechanism',
    'quorum',
    'screen',
    'verify',
    'switch',
  ],
  shortTerm: [
    'short_gain',
    'easy',
    'cheap',
    'fast',
    'slack',
    'overuse',
    'old_path',
    'comfort',
  ],
  careful: [
    'careful',
    'restraint',
    'explore',
    'confirm',
    'negotiate',
    'communicate',
    'balance',
  ],
  risk: [
    'misaligned',
    'gaming',
    'single_point',
    'anti_rule',
    'defect',
    'conflict',
    'opaque',
    'pass_risk',
  ],
} as const;

const countTaggedMoves = (history: ChoiceHistoryItem[], tags: readonly string[]) => {
  return history.reduce((count, item) => {
    return count + (item.tags.some((tag) => tags.includes(tag)) ? 1 : 0);
  }, 0);
};

const findPrimaryImpact = (config: GameConfig, history: ChoiceHistoryItem[]) => {
  const totals = new Map<string, number>();

  history.forEach((item) => {
    Object.entries(item.effects).forEach(([key, delta]) => {
      totals.set(key, (totals.get(key) ?? 0) + Math.abs(delta));
    });
  });

  const [key, value] = [...totals.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['', 0];
  if (!key || value === 0) {
    return '影响较均衡';
  }

  return `${config.stateLabels[key]?.label ?? key}波动最大`;
};

const pickProfile = (
  institutionMoves: number,
  shortTermMoves: number,
  carefulMoves: number,
  riskMoves: number,
) => {
  if (institutionMoves >= 3 && institutionMoves >= shortTermMoves) {
    return {
      title: '制度设计者',
      summary: '你多次选择把个人行动放进规则、核验或共同约束里。你的路线更像是在改激励结构，而不是只劝人做好事。',
    };
  }

  if (shortTermMoves >= 3 && shortTermMoves >= carefulMoves) {
    return {
      title: '短期收益者',
      summary: '你经常选择眼前更顺手、更快或更划算的行动。它们单次看很合理，但也更容易把长期成本推给系统。',
    };
  }

  if (riskMoves >= 3) {
    return {
      title: '高风险推进者',
      summary: '你的路线里有较多压低约束、跳过验证或把风险外推的选择。游戏结果会更明显地暴露系统脆弱处。',
    };
  }

  if (carefulMoves >= 3) {
    return {
      title: '谨慎探索者',
      summary: '你倾向先验证、谈判、试走或保留选择空间。这能降低误判，但有时也需要制度化才能真正改变系统。',
    };
  }

  return {
    title: '摇摆的参与者',
    summary: '你的选择在短期便利、谨慎验证和制度治理之间摇摆。这个结果适合用来观察概念机制如何被不同动机拉扯。',
  };
};

export class StrategyProfileEvaluator {
  static evaluate(config: GameConfig, history: ChoiceHistoryItem[]): StrategyProfile {
    const institutionMoves = countTaggedMoves(history, tagGroups.institution);
    const shortTermMoves = countTaggedMoves(history, tagGroups.shortTerm);
    const carefulMoves = countTaggedMoves(history, tagGroups.careful);
    const riskMoves = countTaggedMoves(history, tagGroups.risk);
    const profile = pickProfile(institutionMoves, shortTermMoves, carefulMoves, riskMoves);

    return {
      ...profile,
      stats: [
        `制度/验证行动：${institutionMoves}`,
        `短期便利行动：${shortTermMoves}`,
        `谨慎探索行动：${carefulMoves}`,
        `高风险行动：${riskMoves}`,
        findPrimaryImpact(config, history),
      ],
    };
  }
}
