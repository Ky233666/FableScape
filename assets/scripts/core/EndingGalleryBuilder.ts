import type { EndingConfig, EndingGalleryItem, GameConfig, StateCondition, TagCondition } from '../data/types';

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
  conflict: '冲突',
  defect: '背离',
};

const formatStateHint = (config: GameConfig, condition: StateCondition) => {
  const label = config.stateLabels[condition.key]?.label ?? condition.key;
  if (condition.op === '>=' || condition.op === '>') {
    return `让${label}更高`;
  }
  if (condition.op === '<=' || condition.op === '<') {
    return `让${label}更低`;
  }
  return `让${label}接近 ${condition.value}`;
};

const formatTagHint = (condition: TagCondition) => {
  return `多选择「${tagLabels[condition.tag] ?? condition.tag}」行动`;
};

const getLockedHint = (config: GameConfig, ending: EndingConfig) => {
  const hints = [
    ...(ending.condition.state ?? []).map((condition) => formatStateHint(config, condition)),
    ...(ending.condition.tags ?? []).map((condition) => formatTagHint(condition)),
  ];

  if (hints.length === 0) {
    return '基础分支：完成任意路线即可遇到。';
  }

  return `线索：${hints.slice(0, 2).join('；')}`;
};

export class EndingGalleryBuilder {
  static build(config: GameConfig, seenEndingIds: string[]): EndingGalleryItem[] {
    const seen = new Set(seenEndingIds);
    return config.endings
      .slice()
      .sort((left, right) => right.priority - left.priority)
      .map((ending) => {
        const unlocked = seen.has(ending.id);
        return {
          id: ending.id,
          title: unlocked ? ending.title : '未解锁结局',
          unlocked,
          hint: unlocked ? ending.conceptReveal : getLockedHint(config, ending),
        };
      });
  }
}
