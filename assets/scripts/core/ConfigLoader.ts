import type { GameCatalogItem, GameConfig } from '../data/types';
import { ConfigValidator } from './ConfigValidator';
import { commonsTragedyConfig } from '../data/commonsTragedyConfig';
import { prisonersDilemmaConfig } from '../data/prisonersDilemmaConfig';
import { informationCocoonConfig } from '../data/informationCocoonConfig';
import { moralHazardConfig } from '../data/moralHazardConfig';
import { adverseSelectionConfig } from '../data/adverseSelectionConfig';
import { pathDependenceConfig } from '../data/pathDependenceConfig';
import { incentiveCompatibilityConfig } from '../data/incentiveCompatibilityConfig';
import { byzantineFaultToleranceConfig } from '../data/byzantineFaultToleranceConfig';

const gameConfigs: GameConfig[] = [
  commonsTragedyConfig,
  prisonersDilemmaConfig,
  informationCocoonConfig,
  moralHazardConfig,
  adverseSelectionConfig,
  pathDependenceConfig,
  incentiveCompatibilityConfig,
  byzantineFaultToleranceConfig,
];

const configIssues = ConfigValidator.validateRegistry(gameConfigs);
if (configIssues.length > 0) {
  console.warn(
    '[FableScape] Game config validation issues:',
    configIssues.map((issue) => `${issue.configId} ${issue.path}: ${issue.message}`).join('\n'),
  );
}

export class ConfigLoader {
  static listGames(): GameCatalogItem[] {
    return gameConfigs.map((config) => ({
      id: config.id,
      title: config.title,
      subtitle: config.subtitle,
      conceptName: config.conceptName,
      playerRole: config.playerRole,
    }));
  }

  static loadDefaultGame(): GameConfig {
    return gameConfigs[0];
  }

  static loadGame(gameId: string): GameConfig {
    return gameConfigs.find((config) => config.id === gameId) ?? this.loadDefaultGame();
  }
}
