import type { ConceptCheck, GameConfig } from '../data/types';

const fallbackMeanings = [
  '短期个人收益',
  '长期系统成本',
  '需要被共同设计的规则',
];

const rotateOptions = <T>(options: T[], offset: number) => {
  if (options.length === 0) {
    return options;
  }

  const normalized = offset % options.length;
  return [...options.slice(normalized), ...options.slice(0, normalized)];
};

export class ConceptCheckBuilder {
  static build(config: GameConfig): ConceptCheck {
    const mappings = config.metaphorMapping;
    const target = mappings[0] ?? {
      storyElement: config.title,
      realWorldMeaning: config.conceptName,
    };
    const distractors = mappings
      .slice(1)
      .map((item) => item.realWorldMeaning)
      .filter((meaning) => meaning !== target.realWorldMeaning);
    const optionTexts = [target.realWorldMeaning, ...distractors, ...fallbackMeanings]
      .filter((meaning, index, all) => all.indexOf(meaning) === index)
      .slice(0, 3);
    const options = rotateOptions(
      optionTexts.map((text) => ({
        text,
        isCorrect: text === target.realWorldMeaning,
      })),
      target.storyElement.length,
    );

    return {
      question: `在这个寓言里，「${target.storyElement}」主要隐喻什么？`,
      options,
      correctFeedback: `正确。「${target.storyElement}」对应的是：${target.realWorldMeaning}。`,
      wrongFeedback: `再想想故事结构。这个元素真正对应的是：${target.realWorldMeaning}。`,
    };
  }
}
