import type { ChoiceConfig, EndingCondition, GameConfig, GameValues, StateLabels, VisualStateBindings } from '../data/types';

export interface ConfigValidationIssue {
  configId: string;
  path: string;
  message: string;
}

const pushIssue = (issues: ConfigValidationIssue[], configId: string, path: string, message: string) => {
  issues.push({ configId, path, message });
};

const hasStateKey = (labels: StateLabels, key: string) => Object.prototype.hasOwnProperty.call(labels, key);

const validateEffects = (
  issues: ConfigValidationIssue[],
  configId: string,
  labels: StateLabels,
  effects: GameValues,
  path: string,
) => {
  Object.keys(effects).forEach((key) => {
    if (!hasStateKey(labels, key)) {
      pushIssue(issues, configId, `${path}.effects.${key}`, 'choice effect references a state key without a state label');
    }
  });
};

const validateChoice = (
  issues: ConfigValidationIssue[],
  config: GameConfig,
  choice: ChoiceConfig,
  path: string,
) => {
  if (!choice.id) {
    pushIssue(issues, config.id, `${path}.id`, 'choice id is required');
  }
  if (!choice.text) {
    pushIssue(issues, config.id, `${path}.text`, 'choice text is required');
  }
  if (!choice.feedback) {
    pushIssue(issues, config.id, `${path}.feedback`, 'choice feedback is required');
  }
  validateEffects(issues, config.id, config.stateLabels, choice.effects, path);
};

const validateCondition = (
  issues: ConfigValidationIssue[],
  config: GameConfig,
  condition: EndingCondition,
  path: string,
) => {
  (condition.state ?? []).forEach((rule, index) => {
    if (!hasStateKey(config.stateLabels, rule.key)) {
      pushIssue(issues, config.id, `${path}.state[${index}].key`, 'ending condition references a state key without a state label');
    }
  });
};

const validateBindings = (
  issues: ConfigValidationIssue[],
  config: GameConfig,
  bindings: VisualStateBindings | undefined,
) => {
  if (!bindings) {
    pushIssue(issues, config.id, 'visualTheme.stateBindings', 'state bindings are recommended for config-driven visuals');
    return;
  }

  [
    ['resourceKey', bindings.resourceKey],
    ['wealthKey', bindings.wealthKey],
    ['trustKey', bindings.trustKey],
    ['governanceKey', bindings.governanceKey],
  ].forEach(([bindingName, key]) => {
    if (!hasStateKey(config.stateLabels, key)) {
      pushIssue(
        issues,
        config.id,
        `visualTheme.stateBindings.${bindingName}`,
        `binding references unknown state key "${key}"`,
      );
    }
  });
};

export class ConfigValidator {
  static validateGameConfig(config: GameConfig): ConfigValidationIssue[] {
    const issues: ConfigValidationIssue[] = [];
    const stateKeys = Object.keys(config.stateLabels);

    if (!config.id) {
      pushIssue(issues, config.id || '<missing-id>', 'id', 'game id is required');
    }
    if (!config.title) {
      pushIssue(issues, config.id, 'title', 'game title is required');
    }
    if (stateKeys.length === 0) {
      pushIssue(issues, config.id, 'stateLabels', 'at least one state label is required');
    }

    Object.keys(config.initialState).forEach((key) => {
      if (!hasStateKey(config.stateLabels, key)) {
        pushIssue(issues, config.id, `initialState.${key}`, 'initial state key has no matching state label');
      }
    });

    stateKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(config.initialState, key)) {
        pushIssue(issues, config.id, `stateLabels.${key}`, 'state label has no matching initial value');
      }
    });

    if (config.rounds.length === 0) {
      pushIssue(issues, config.id, 'rounds', 'at least one round is required');
    }

    config.rounds.forEach((round, roundIndex) => {
      const roundPath = `rounds[${roundIndex}]`;
      if (!round.id) {
        pushIssue(issues, config.id, `${roundPath}.id`, 'round id is required');
      }
      if (round.choices.length < 2 || round.choices.length > 3) {
        pushIssue(issues, config.id, `${roundPath}.choices`, 'each round should expose 2 to 3 choices');
      }
      round.choices.forEach((choice, choiceIndex) => {
        validateChoice(issues, config, choice, `${roundPath}.choices[${choiceIndex}]`);
      });
    });

    if (config.endings.length === 0) {
      pushIssue(issues, config.id, 'endings', 'at least one ending is required');
    }
    if (!config.endings.some((ending) => ending.priority === 0)) {
      pushIssue(issues, config.id, 'endings', 'a fallback ending with priority 0 is recommended');
    }
    config.endings.forEach((ending, endingIndex) => {
      const endingPath = `endings[${endingIndex}]`;
      if (!ending.id) {
        pushIssue(issues, config.id, `${endingPath}.id`, 'ending id is required');
      }
      validateCondition(issues, config, ending.condition, `${endingPath}.condition`);
    });

    validateBindings(issues, config, config.visualTheme.stateBindings);
    return issues;
  }

  static validateRegistry(configs: GameConfig[]): ConfigValidationIssue[] {
    const issues: ConfigValidationIssue[] = [];
    const seenIds = new Set<string>();

    configs.forEach((config) => {
      issues.push(...this.validateGameConfig(config));
      if (seenIds.has(config.id)) {
        pushIssue(issues, config.id, 'id', 'duplicate game id in registry');
      }
      seenIds.add(config.id);
    });

    return issues;
  }
}
